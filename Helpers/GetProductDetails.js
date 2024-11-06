const GetProductDetails = (product, variantsId) => {
  let productDetails;

  const productType = product.productType;

  if (product) {
    if (productType === "variable") {
      if (variantsId?.length === 2) {
        const productVariant = product.variants.find((variant) =>
          variant.variantsId.every((id) => variantsId.includes(id))
        );

        if (productVariant) {
          productDetails = {
            _id: product._id,
            title: product.title,
            desc: product.desc,
            category: product.category,
            productType: product.productType,
            variantsOptions: product.variantsOptions,
            variantId: productVariant._id,
            variantName: productVariant.variantName,
            variantsId: productVariant.variantsId,
            images: productVariant.images,
            regularPrice: productVariant.regularPrice,
            salePrice: productVariant.salePrice,
            tax: productVariant.tax,
            totalStocks: productVariant.totalStocks,
            inStock: productVariant.inStock,
          };
        }
      } else {
        const productVariant = product.variants[0];

        productDetails = {
          _id: product._id,
          title: product.title,
          desc: product.desc,
          category: product.category,
          productType: product.productType,
          variantsOptions: product.variantsOptions,
          variantId: productVariant._id,
          variantName: productVariant.variantName,
          variantsId: productVariant.variantsId,
          images: productVariant.images,
          regularPrice: productVariant.regularPrice,
          salePrice: productVariant.salePrice,
          tax: productVariant.tax,
          totalStocks: productVariant.totalStocks,
          inStock: productVariant.inStock,
        };
      }
    } else {
      productDetails = {
        _id: product._id,
        title: product.title,
        desc: product.desc,
        category: product.category,
        productType: product.productType,
        images: product.images,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice,
        tax: product.tax,
        totalStocks: product.totalStocks,
        inStock: product.inStock,
      };
    }
  }

  if (!productDetails) {
    // Handle the case when no matching variant is found
    return null;
  }

  return productDetails;
};

export default GetProductDetails;
