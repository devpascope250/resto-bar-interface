"use client";
import type React from "react";
import { CompactFormErrorDisplay } from "@/components/ui/CompactFormErrorDisplay";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useApi } from "@/hooks/api-hooks";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as SelectInput,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageLibraryDialog } from "./image-library-dialog"; // Import the new component
import { Switch } from "../ui/switch";
import { UtilData } from "@/lib/utile-data";
import { TaxStatus, User } from "@prisma/client";
import { useAuthStore } from "@/lib/store/auth-store";
interface AddProductDialogProps {
  onProductAdded?: () => void;
  selectedProduct?: Product | null;
}

export function AddProductDialog({
  onProductAdded,
  selectedProduct,
}: AddProductDialogProps) {
  const { useApiPost, useApiQuery, useApiPut } = useApi();
  const { user } = useAuthStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const { toast } = useToast();

  const { mutateAsync: createProduct, isPending: creatingProduct } = useApiPost(
    ["products"],
    "/bar/products"
  );

  const [searchingItemCls, setSearchingItemCls] = useState("");
  const [searchingorgnNatCd, setSearchingorgnNatCd] = useState("");
  const [searchinqtyUnitCdes, setSearchingqtyUnitCdes] = useState(""); 
  const [searchinqtytaxTyCdes, setSearchinqtytaxTyCdes] = useState("");
  const [searchinPkgUnitCdes, setSearchingPkgUnitCdes] = useState("");
  // get item codes
 const [selectedProd, setSelectedProd] = useState<Product | null>(
    selectedProduct || null
  );

  const {
    data: itemCodes,
    isLoading: isItemCodesLoading,
    isRefetching: isRefetchingItemCode,
  } = useApiQuery(
    ["item-codes", searchingItemCls],
    `/ebm/all-item-classifications${
      searchingItemCls ? `?query=${searchingItemCls}` : ""
    }`,
    {
      enabled: open,
    }
  );

    const { data: itemTypes, isLoading: isiTemLoading } = useApiQuery(
    ["item-type"],
    "/ebm/codes/cdClsNm/Item Type",
    {
      enabled: open && !!itemCodes,
    }
  );

  const {
    data: orgnNatCdes,
    isLoading: isLoadingorgnNatCodesLoading,
    isRefetching: isRefetchingorgnNatCd,
  } = useApiQuery(
    ["cdClsNm", searchingorgnNatCd],
    `/ebm/codes/cdClsNm/Cuntry${
      searchingorgnNatCd ? `?query=${searchingorgnNatCd}` : ""
    }`,
    {
      enabled: open && !!itemTypes,
    }
  );

  const {
    data: qtyUnitCdes,
    isLoading: isLoadingQtyUnitCdes,
    isRefetching: isRefetchinQtyUnitCdes,
  } = useApiQuery(
    ["qtyUnitCdes", searchinqtyUnitCdes],
    `/ebm/codes/cdClsNm/Quantity Unit${
      searchinqtyUnitCdes ? `?query=${searchinqtyUnitCdes}` : ""
    }`,
    {
      enabled: open &&!!orgnNatCdes,
    }
  );

  const {
    data: taxTyCdes,
    isLoading: isLoadingTaxTyCdes,
    isRefetching: isRefetchinTaxTyCdes,
  } = useApiQuery(
    ["taxTyCd", searchinqtytaxTyCdes],
    `/ebm/codes/cdClsNm/Taxation Type${
      searchinqtytaxTyCdes ? `?query=${searchinqtytaxTyCdes}` : ""
    }`,
    {
      enabled: open && !!qtyUnitCdes,
    }
  );


    const {
    data: pkgUnitCdes,
    isLoading: isLoadingpkgUnitCdes,
    isRefetching: isRefetchinpkgUnitCdes,
  } = useApiQuery(
    ["pkgUnitCd", searchinPkgUnitCdes],
    `/ebm/codes/cdClsNm/Packing Unit${
      searchinPkgUnitCdes ? `?query=${searchinPkgUnitCdes}` : ""
    }`,
    {
      enabled: open && !!taxTyCdes,
    }
  );


      const { data: latest_item_code, isLoading: isLoadingLetestItemCode } = useApiQuery<string>(
    ["latest-item-code"],
    "/ebm/items/latest-item-code",
    {
      enabled: open && !!pkgUnitCdes,
    }
  );

    const { data: categories, isLoading: isCategoriesLoading } = useApiQuery<
    BeverageCategory[]
  >(["bvg-category"], "/bar/beverage-category", {
    enabled: open && !!latest_item_code,
  });

 
  const { mutateAsync: updateProduct, isPending: updatingProduct } = useApiPut(
    ["products"],
    `/bar/products/${selectedProd?.id}`
  );
  
  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedProd(selectedProduct);
    if (selectedProduct.image) {
      setSelectedImageUrl(selectedProduct.image);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProd) {
      setIsEdit(true);
    }
  }, [selectedProd]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .min(0, "Price must be greater than 0")
      .required("Price is required"),
    productType: Yup.string().required("Category is required"),
    currentStock: Yup.number().required("Stock is required"),
    beverageSize: Yup.string().when("productType", {
      is: "BEVERAGE",
      then: (schema) =>
        schema
          .required("Beverage size is required")
          .oneOf(
            ["SMALL", "MEDIUM", "LARGE", "XL", "NORMAL"],
            "Invalid beverage size"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    beverageCategoryId: Yup.string().when("productType", {
      is: "BEVERAGE",
      then: (schema) => schema.required("Beverage category is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string(),
    itemClsCd: Yup.string().required("Item Class Code is required"),
    itemCd: Yup.string().required("Item Code is required"),
    itemTyCd: Yup.string().required("Item Type Code is required"),
    orgnNatCd: Yup.string().required("Country Code is required"),
    qtyUnitCd: Yup.string().required("Quantity Unit Code is required"),
    taxTyCd: Yup.string().required("Tax Type Code is required"),
    pkgUnitCd: Yup.string().required("Packing Unit Code is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(selectedProd === null ? { itemClsCd: "" } : {}),
      ...(selectedProd === null ? { itemCd: "" } : {}),
      ...(selectedProd === null ? { itemTyCd: "" } : {}),
      ...(selectedProd === null ? { orgnNatCd: "" } : {}),
      ...(selectedProd === null ? { pkgUnitCd: "" } : {}),
      ...(selectedProd === null ? { qtyUnitCd: "" } : {}),
      ...(selectedProd === null ? { taxTyCd: "" } : {}),
      ...(selectedProd === null ? { btchNo: "" } : {}),
      ...(selectedProd === null ? {bcd: ""} : {}),
      ...(selectedProd === null ? {isrcAplcbYn: false} : {}),
      ...(selectedProd === null ? { useYn : false} : {}),
      productType: selectedProd?.productType || "",
      name: selectedProd?.name || "",
      beverageSize: selectedProd?.beverageSize || "",
      description: selectedProd?.description || "",
      price: selectedProd?.price.toString() || "",
      currentStock: selectedProd?.currentStock.toString() || "",
      image: selectedProd?.image || "",
      beverageCategoryId: selectedProd?.beverageCategory?.id?.toString() || "",
      beverageCat: selectedProd?.beverageCategory?.type || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      if (values.itemClsCd) formData.append("itemClsCd", values.itemClsCd);
      if (values.itemCd) formData.append("itemCd", values.itemCd);
      if (values.itemTyCd) formData.append("itemTyCd", values.itemTyCd);
      if (values.orgnNatCd) formData.append("orgnNatCd", values.orgnNatCd);
      if (values.qtyUnitCd) formData.append("qtyUnitCd", values.qtyUnitCd);
      if (values.taxTyCd) formData.append("taxTyCd", values.taxTyCd);
      if (values.btchNo) formData.append("btchNo", values.btchNo);
      if (values.bcd) formData.append("bcd", values.bcd);
      if(values.pkgUnitCd) formData.append("pkgUnitCd", values.pkgUnitCd);
      if (values.isrcAplcbYn)
        formData.append("isrcAplcbYn", values.isrcAplcbYn === true ? "Y" : "N");
      if (values.useYn)
        formData.append("useYn", values.useYn === true ? "Y" : "N");
      if (values.name) formData.append("name", values.name);
      if (values.description)
        formData.append("description", values.description);
      if (values.price) formData.append("price", values.price);
      if (values.productType)
        formData.append("productType", values.productType);
      if (values.currentStock)
        formData.append("currentStock", values.currentStock);
      if (values.beverageSize)
        formData.append("beverageSize", values.beverageSize);
      if (values.beverageCategoryId)
        formData.append("beverageCategoryId", values.beverageCategoryId);

      // Handle image - either from library or file upload
      if (selectedImageUrl) {
        formData.append("imageUrl", selectedImageUrl);
      } else if (image) {
        formData.append("image", image);
      } else if (selectedProd === null) {
        return toast({
          title: "Error creating product",
          description: "Please select an image from library or upload one",
          variant: "error",
        });
      }

      if (selectedProd !== null) {
        updateProduct(formData)
          .then((response) => {
            setSelectedProd(null);
            setIsEdit(false);
            setOpen(false);
            resetForm();
            toast({
              title: "Product updated",
              description: `${values.name} has been updated in the catalog.`,
              variant: "success",
            });
            onProductAdded?.();
          })
          .catch((error) => {
            console.log(error);
            toast({
              title: "Error updating product",
              description: error.message,
              variant: "error",
            });
          });
      } else {
        createProduct(formData)
          .then((response) => {
            setOpen(false);
            resetForm();
            toast({
              title: "Product created",
              description: `${values.name} has been added to the catalog.`,
              variant: "success",
            });
            onProductAdded?.();
          })
          .catch((error) => {
            toast({
              title: "Error creating product",
              description: error.message,
              variant: "error",
            });
          });
      }
    },
  });

  const resetForm = () => {
    setSelectedImageUrl("");
    setImage(null);
    setSelectedProd(null);
    setIsEdit(false);
    formik.resetForm();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      resetForm();
    } else {
      setOpen(true);
    }
  };

  const handleImageSelectFromLibrary = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImage(null); // Clear any uploaded file
    formik.setFieldValue("image", imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setSelectedImageUrl(""); // Clear any library selection
    if (file) {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      setSelectedImageUrl(localUrl);
    }
  };
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchItemClsCd = (value: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      if (value === "") {
        setSearchingItemCls("");
      } else if (value.length >= 2) {
        setSearchingItemCls(value);
      }
    }, 500);
  };
 
const handleSearchOrignCount = (value: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      if (value === "") {
        setSearchingorgnNatCd("");
      } else if (value.length >= 2) {
        setSearchingorgnNatCd(value);
      }
    }, 500);
}

const handleSearchQuatyUnity = (value: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      if (value === "") {
        setSearchingqtyUnitCdes("");
      } else if (value.length >= 2) {
        setSearchingqtyUnitCdes(value);
      }
    }, 500);
}


const handleSearchTaxationtype = (value: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      if (value === "") {
        setSearchinqtytaxTyCdes("");
      } else if (value.length >= 2) {
        setSearchinqtytaxTyCdes(value);
      }
    }, 500);
}


const handleSearchPkgUnit = (value: string) => {
   // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      if (value === "") {
        setSearchingPkgUnitCdes("");
      } else if (value.length >= 2) {
        setSearchingPkgUnitCdes(value);
      }
    }, 500);
}

const generateNewItem = new UtilData();
  useEffect(()=> {
    console.log();
    
   formik.setFieldValue("itemCd",generateNewItem.generateItemCode(formik.values.orgnNatCd ?? "", formik.values.itemTyCd ?? "", formik.values.pkgUnitCd ?? "", formik.values.qtyUnitCd ?? "", latest_item_code));
    
  },[formik.values])
  return (
    <>
      <Dialog open={open || isEdit} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProd !== null ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {selectedProd !== null
                ? "Edit the product in the catalog."
                : "Create a new product in the catalog."}
            </DialogDescription>
          </DialogHeader>

          <CompactFormErrorDisplay
            errors={formik.errors}
            touched={formik.touched}
            className="mb-4"
          >
            {(errorMessages) => (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-red-800 font-medium">Form Errors</h3>
                </div>
                <div className="mt-2 text-red-700 text-sm">
                  {errorMessages.join(", ")}
                </div>
              </div>
            )}
          </CompactFormErrorDisplay>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              {
                selectedProd === null ? (
                  <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="Item Classification"> Item Class <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onInputChange={handleSearchItemClsCd}
                    onChange={(value: any) => {
                      formik.setFieldValue("itemClsCd", value.value);
                    }}
                    isLoading={isItemCodesLoading || isRefetchingItemCode}
                    name="itemClsCd"
                    id="itemClsCd"
                    options={
                      itemCodes
                        ? (itemCodes as any).slice(0, 20).map((item: any) => ({
                            value: item.itemClsCd,
                            label: item.itemClsNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.itemClsCd && formik.errors.itemClsCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="Item Classification">Item Type <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onChange={(value: any) => {
                      formik.setFieldValue("itemTyCd", value.value);
                    }}
                    isLoading={isiTemLoading}
                    name="itemTyCd"
                    id="itemTyCd"
                    options={
                      itemTypes
                        ? (itemTypes as any).map((item: any) => ({
                            value: item.cd,
                            label: item.cdNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.itemTyCd && formik.errors.itemTyCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="Item Classification">Origin Country <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onInputChange={handleSearchOrignCount}
                    onChange={(value: any) => {
                      formik.setFieldValue("orgnNatCd", value.value);
                    }}
                    isLoading={
                      isLoadingorgnNatCodesLoading || isRefetchingorgnNatCd
                    }
                    name="orgnNatCd"
                    id="orgnNatCd"
                    options={
                      orgnNatCdes
                        ? (orgnNatCdes as any).map((item: any) => ({
                            value: item.cd,
                            label: item.cdNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.orgnNatCd && formik.errors.orgnNatCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="Item Classification">Quantity Unity <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onInputChange={handleSearchQuatyUnity}
                    onChange={(value: any) => {
                      formik.setFieldValue("qtyUnitCd", value.value);
                    }}
                    isLoading={isLoadingQtyUnitCdes || isRefetchinQtyUnitCdes}
                    name="qtyUnitCd"
                    id="qtyUnitCd"
                    options={
                      qtyUnitCdes
                        ? (qtyUnitCdes as any).map((item: any) => ({
                            value: item.cd,
                            label: item.cdNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.qtyUnitCd && formik.errors.qtyUnitCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="Item Classification">Tax Type <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onInputChange={handleSearchTaxationtype}
                    onChange={(value: any) => {
                      formik.setFieldValue("taxTyCd", value.value);
                    }}
                    isLoading={isLoadingTaxTyCdes || isRefetchinTaxTyCdes}
                    name="taxTyCd"
                    id="taxTyCd"
                    options={
                      taxTyCdes
                        ? (taxTyCdes as any[]).filter((item) => (user?.taxStatus === "ENABLED" ? item.cd !== "D" : item.cd === "D")) .map((item: any) => ({
                            value: item.cd,
                            label: item.cdNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.taxTyCd && formik.errors.taxTyCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="Item Classification">Packaging Unit <span className="text-red-500 text-sm ">*</span></Label>
                  <Select
                    // isDisabled={isItemCodesLoading}
                    isSearchable={true}
                    onInputChange={handleSearchPkgUnit}
                    onChange={(value: any) => {
                      formik.setFieldValue("pkgUnitCd", value.value);
                    }}
                    isLoading={isLoadingpkgUnitCdes || isRefetchinpkgUnitCdes}
                    name="pkgUnitCd"
                    id="pkgUnitCd"
                    options={
                      pkgUnitCdes
                        ? (pkgUnitCdes as any).map((item: any) => ({
                            value: item.cd,
                            label: item.cdNm,
                          }))
                        : []
                    }
                    className={`border rounded-sm${formik.touched.pkgUnitCd && formik.errors.pkgUnitCd ? 'border border-red-500 rounded-sm' : ""}`}
                  ></Select>
                </div>
              </div>
                ): ""
              }
              

              <div className="grid grid-cols-2 gap-4">
                
                <div className="grid gap-2">
                  <Label htmlFor="productType">Select Type</Label>
                  <SelectInput
                    value={formik.values.productType}
                    name="productType"
                    onValueChange={(value) =>
                      formik.setFieldValue("productType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEVERAGE">Beverage</SelectItem>
                      <SelectItem value="FOOD">Food</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </SelectInput>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Product Code <span className="text-red-500 text-sm ">*</span></Label>
                  <Input
                    id="itemCd"
                    name="itemCd"
                    type="text"
                    value={formik.values.itemCd}
                    readOnly
                    // onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name <span className="text-red-500 text-sm ">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border rounded-sm${formik.touched.name && formik.errors.name ? 'border border-red-500 rounded-sm' : ""}`}
                  />
                  
                </div>
              </div>

              {formik.values.productType === "BEVERAGE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="beverageCat">category</Label>
                    <SelectInput
                      value={formik.values.beverageCat}
                      name="beverageCat"
                      onValueChange={(value) =>
                        formik.setFieldValue("beverageCat", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALCOHOLIC">Alcoholic</SelectItem>
                        <SelectItem value="NON_ALCOHOLIC">
                          Non Alcoholic
                        </SelectItem>
                      </SelectContent>
                    </SelectInput>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productType">Select Name</Label>
                    <SelectInput
                      value={formik.values.beverageCategoryId?.toString()} // 确保转换为字符串
                      name="beverageCategoryId"
                      onValueChange={(value) =>
                        formik.setFieldValue("beverageCategoryId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Name" />
                      </SelectTrigger>
                      <SelectContent>
                        {!formik.values.beverageCat
                          ? []
                          : categories
                              ?.filter(
                                (cat) => cat.type === formik.values.beverageCat
                              )
                              .map((category) => {
                                return (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {
                                      // display name and its description
                                      category.name +
                                        " - " +
                                        category.description
                                    }
                                  </SelectItem>
                                );
                              })}
                      </SelectContent>
                    </SelectInput>
                  </div>
                </div>
              )}
              {formik.values.productType === "BEVERAGE" && (
                <div className="grid gap-2">
                  <Label htmlFor="beverageSize">Beverage Size</Label>
                  <SelectInput
                    value={formik.values.beverageSize}
                    name="beverageSize"
                    onValueChange={(value) =>
                      formik.setFieldValue("beverageSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {["SMALL", "MEDIUM", "LARGE", "XL", "NORMAL"].map(
                        (size) => {
                          return (
                            <SelectItem key={size} value={size}>
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </SelectInput>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (Rwf) <span className="text-red-500 text-sm ">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border rounded-sm${formik.touched.price&&formik.errors.price ? "border rounded-sm border-red-500" : ""}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Initial Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    name="currentStock"
                    min={0}
                    value={formik.values.currentStock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={selectedProd !== null}
                    className="disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                {/* No validation for description */}
              </div>
            </div>
            {/* Updated Image Section */}
            <div className="grid gap-4">
              <Label htmlFor="image">Product Image</Label>

              {/* Image Preview */}
              {(selectedImageUrl || formik.values.image) && (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={selectedImageUrl || formik.values.image}
                    alt="Product preview"
                    className="w-16 h-16 object-cover rounded border"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Selected Image</p>
                    <p className="text-xs text-muted-foreground">
                      {image ? "Uploaded file" : "From library"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImageUrl("");
                      setImage(null);
                      formik.setFieldValue("image", "");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Image Selection Options */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageLibrary(true)}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Choose from Library
                </Button>

                <div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload New Image
                  </Label>
                </div>

                <p className="text-xs text-muted-foreground">
                  Choose an image from your library or upload a new one. Library
                  images are shared across all products.
                </p>
              </div>
            </div>

            <div className="grid gap-4 mt-5 mb-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Is Insurance Section */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="isrcAplcbYn">Insurance Appicable(Y/N)</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="useYn">Used / UnUsed</Label>
                </div>

                <div className="flex items-center">
                  <Switch
                    id="isrcAplcbYn"
                    name="isrcAplcbYn"
                    // checked={formik.values.isrcAplcbYn}
                    onCheckedChange={(value) => {
                      formik.setFieldValue("isrcAplcbYn", value);
                    }}
                    checked={formik.values.isrcAplcbYn}
                    className="disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center">
                  <Switch
                    id="useYn"
                    name="useYn"
                    checked={formik.values.useYn}
                    onCheckedChange={(value) => {
                      formik.setFieldValue("useYn", value);
                    }}
                    className="disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingProduct || updatingProduct}
                className="cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {selectedProd !== null
                  ? updatingProduct
                    ? "Updating..."
                    : "Update Product"
                  : creatingProduct
                  ? "Creating..."
                  : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Library Dialog */}
      <ImageLibraryDialog
        open={showImageLibrary}
        onOpenChange={setShowImageLibrary}
        onImageSelect={handleImageSelectFromLibrary}
        currentImage={selectedImageUrl || formik.values.image}
      />
    </>
  );
}
