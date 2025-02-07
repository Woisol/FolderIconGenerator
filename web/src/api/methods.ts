import axiosInstance from "@/api/index.ts";
import {CompositionImageDTO, ImageConfigVO} from "@/api/types.ts";

export const getImageConfig = () => {
  return axiosInstance.get<ImageConfigVO>("/image/config");
};

export const getCompositionImage = (compositionImageDTO: CompositionImageDTO) => {
  return axiosInstance.post<string>("/image/composition", compositionImageDTO);
};

export const checkCwd = (path: string) => {
  return axiosInstance.get<boolean>("/file/cwd", { params: { path } });
};

export const getDirs = (path: string) => {
  return axiosInstance.get<string[]>("/file/dirs", { params: { path } });
};

export const getIcon = (path: string, icoFileName: string) => {
  return axiosInstance.get<string>("/file/icon", { params: { path, icoFileName } });
};

export const setIcon = (path: string, icoFileName: string) => {
  return axiosInstance.post("/file/icon", { path, icoFileName });
};
