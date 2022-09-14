import { ApolloQueryResult } from "@apollo/client";
import { useAuthState } from "@saleor/sdk";
import clsx from "clsx";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import React, { ReactElement, useState } from "react";
import { useIntl } from "react-intl";

import { Layout, RichText, VariantSelector } from "@/components";
import { AttributeDetails } from "@/components/product/AttributeDetails";
import { Slider } from "@/components/product/SlideShow";
// import { ProductGallery } from "@/components/product/ProductGallery";
import { useRegions } from "@/components/RegionsProvider";
import { ProductPageSeo } from "@/components/seo/ProductPageSeo";
import { messages } from "@/components/translations";
import apolloClient from "@/lib/graphql";
import { mapEdgesToItems } from "@/lib/maps";
import { usePaths } from "@/lib/paths";
import { getSelectedVariantID } from "@/lib/product";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import {
  CheckoutError,
  ProductBySlugDocument,
  ProductBySlugQuery,
  ProductBySlugQueryVariables,
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
  useProductSimilarQuery,
} from "@/saleor/api";

export type OptionalQuery = {
  variant?: string;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const buttonText = (selectedVariant: undefined | object, loadingAddToCheckout: boolean, t: any) => {
  if (!selectedVariant) {
    return t.formatMessage(messages.variantNotChosen);
  }
  if (loadingAddToCheckout) {
    return t.formatMessage(messages.adding);
  }
  return t.formatMessage(messages.addToCart);
};

export const randomLast = Math.floor(Math.random() * 30);

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const productSlug = context.params?.slug?.toString()!;
  const response: ApolloQueryResult<ProductBySlugQuery> = await apolloClient.query<
    ProductBySlugQuery,
    ProductBySlugQueryVariables
  >({
    query: ProductBySlugDocument,
    variables: {
      slug: productSlug,
      ...contextToRegionQuery(context),
    },
  });
  return {
    props: {
      product: response.data.product,
      category: response.data.product?.category,
      cursor: response,
    },
    revalidate: 60, // value in seconds, how often ISR will trigger on the server
  };
};

const ProductPage = ({ product, category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const paths = usePaths();
  const t = useIntl();
  const { currentChannel, formatPrice, query } = useRegions();

  const { checkoutToken, setCheckoutToken, checkout } = useCheckout();

  const [createCheckout] = useCreateCheckoutMutation();
  const { user } = useAuthState();

  const { data } = useProductSimilarQuery({
    variables: {
      category: category?.id.toString()!,
      channel: "default-channel",
      locale: "RU_KZ",
      last: randomLast,
    },
  });

  const similarProducts = mapEdgesToItems(data?.products).filter((e) => e.id !== product?.id);
  const randomSimilarProducts = similarProducts.sort(() => 0.5 - Math.random()).slice(0, 2);

  const [addProductToCheckout] = useCheckoutAddProductLineMutation();
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false);
  const [addToCartError, setAddToCartError] = useState("");

  if (!product?.id) {
    return <Custom404 />;
  }

  const selectedVariantID = getSelectedVariantID(product, router);

  const selectedVariant = product?.variants?.find((v) => v?.id === selectedVariantID) || undefined;

  const onAddToCart = async () => {
    // Clear previous error messages
    setAddToCartError("");

    // Block add to checkout button
    setLoadingAddToCheckout(true);
    const errors: CheckoutError[] = [];

    if (!selectedVariantID) {
      return;
    }

    if (checkout) {
      // If checkout is already existing, add products
      const { data: addToCartData } = await addProductToCheckout({
        variables: {
          checkoutToken,
          variantId: selectedVariantID,
          locale: query.locale,
        },
      });
      addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
        if (e) {
          errors.push(e);
        }
      });
    } else {
      // Theres no checkout, we have to create one
      const { data: createCheckoutData } = await createCheckout({
        variables: {
          email: user?.email,
          channel: currentChannel.slug,
          lines: [
            {
              quantity: 1,
              variantId: selectedVariantID,
            },
          ],
        },
      });
      createCheckoutData?.checkoutCreate?.errors.forEach((e) => {
        if (e) {
          errors.push(e);
        }
      });
      if (createCheckoutData?.checkoutCreate?.checkout?.token) {
        setCheckoutToken(createCheckoutData?.checkoutCreate?.checkout?.token);
      }
    }
    // Enable button
    setLoadingAddToCheckout(false);

    if (errors.length === 0) {
      // Product successfully added, redirect to cart page
      router.push(paths.cart.$url());
      return;
    }

    // Display error message
    const errorMessages = errors.map((e) => e.message || "") || [];
    setAddToCartError(errorMessages.join("\n"));
  };

  const isAddToCartButtonDisabled =
    !selectedVariant || selectedVariant?.quantityAvailable === 0 || loadingAddToCheckout;

  const description = translate(product, "description");

  const price = product.pricing?.priceRange?.start?.gross;
  const shouldDisplayPrice = product.variants?.length === 1 && price;

  return (
    <>
      <ProductPageSeo product={product} />
      <main className={clsx("grid grid-cols-1 max-h-full overflow-auto md:overflow-hidden")}>
        <div className="col-span-1">
          {/* <ProductGallery product={product} selectedVariant={selectedVariant} /> */}
          <Slider product={product} mainProduct />
        </div>
        <div className="space-y-5 mt-4 md:mt-0 px-2">
          <div>
            <h1
              className="text-4xl font-bold tracking-tight text-gray-800"
              data-testid="productName"
            >
              {translate(product, "name")}
            </h1>
            {shouldDisplayPrice && (
              <h2 className="text-xl font-bold tracking-tight text-gray-800">
                {formatPrice(price)}
              </h2>
            )}
            {!!product.category?.slug && (
              <p className="text-lg mt-2 font-medium text-gray-600 cursor-pointer">
                {translate(product.category, "name")}
              </p>
            )}
          </div>

          <VariantSelector product={product} selectedVariantID={selectedVariantID} />

          <button
            onClick={onAddToCart}
            type="submit"
            disabled={isAddToCartButtonDisabled}
            className={clsx(
              "w-full py-3 px-8 flex items-center justify-center text-base bg-[#f1f2f3] text-black disabled:bg-[#f9fafa] hover:bg-white  border-2 border-transparent  focus:outline-none",
              !isAddToCartButtonDisabled && "hover:border-[#f1f2f3] hover:text-[#f1f2f3]"
            )}
            data-testid="addToCartButton"
          >
            {buttonText(selectedVariant, loadingAddToCheckout, t)}
          </button>
          {/* 
          {selectedVariant?.quantityAvailable === 0 && (
            <p className="text-base text-yellow-600" data-testid="soldOut">
              {t.formatMessage(messages.soldOut)}
            </p>
          )} */}

          {!!addToCartError && <p>{addToCartError}</p>}

          {description && (
            <div className="space-y-6">
              <RichText jsonStringData={description} />
            </div>
          )}

          <AttributeDetails
            product={product}
            selectedVariant={selectedVariant}
            layoutState
          />
          <div className="grid grid-cols-2 gap-2">
            <p className="col-span-2 font-bold text-[18px] text-[#484848]">Похожие модели</p>
            {randomSimilarProducts.map((similarProduct) => (
              <div key={similarProduct.id}>
                <Slider product={similarProduct} mainProduct={false} />
                <Link
                  href={paths.products._slug(similarProduct.slug).$url()}
                  prefetch={false}
                  passHref
                >
                  <a href="pass" className="flex flex-col w-full">
                    <h1
                      className="text-base font-medium tracking-tight text-gray-600"
                      data-testid="productName"
                    >
                      {translate(similarProduct, "name")}
                    </h1>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
