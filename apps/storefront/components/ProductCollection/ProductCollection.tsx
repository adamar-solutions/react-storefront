import { Text } from "@saleor/ui-kit";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { mapEdgesToItems } from "@/lib/maps";
import {
  OrderDirection,
  ProductCollectionQueryVariables,
  ProductFilterInput,
  ProductOrderField,
  useProductCollectionQuery,
} from "@/saleor/api";

import { Pagination } from "../Pagination";
import { ProductCard } from "../ProductCard";
import { useRegions } from "../RegionsProvider";
import { Spinner } from "../Spinner";
import { messages } from "../translations";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  sortBy?: {
    field: ProductOrderField;
    direction?: OrderDirection;
  };
  allowMore?: boolean;
  perPage?: number;
  mainView?: boolean;
  setCounter?: (value: number) => void;
}

export const ProductCollection = ({
  filter,
  sortBy,
  setCounter,
  allowMore = true,
  perPage = 4,
  mainView = false,
}: ProductCollectionProps) => {
  const t = useIntl();
  const { query } = useRegions();

  const variables: ProductCollectionQueryVariables = {
    filter,
    first: perPage,
    ...query,
    ...(sortBy?.field &&
      sortBy?.direction && {
        sortBy: {
          direction: sortBy.direction,
          field: sortBy.field,
        },
      }),
  };

  const { loading, error, data, fetchMore } = useProductCollectionQuery({
    variables,
  });

  useEffect(() => {
    if (setCounter) {
      setCounter(data?.products?.totalCount || 0);
    }
  }, [setCounter, data?.products?.totalCount]);

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: data?.products?.pageInfo.endCursor,
      },
    });
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;

  const products = mapEdgesToItems(data?.products);
  if (products.length === 0) {
    return (
      <Text size="xl" color="secondary" data-testid="noResultsText">
        {t.formatMessage(messages.noProducts)}
      </Text>
    );
  }
  return (
    <div>
      <ul
        className={`grid gap-2 ${mainView ? "grid-cols-2" : "grid-cols-1"}`}
        data-testid="productsList"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} productCardView={mainView} />
        ))}
      </ul>
      {allowMore && (
        <Pagination
          onLoadMore={onLoadMore}
          pageInfo={data?.products?.pageInfo}
          itemsCount={data?.products?.edges.length}
          totalCount={data?.products?.totalCount || undefined}
        />
      )}
    </div>
  );
};

export default ProductCollection;
