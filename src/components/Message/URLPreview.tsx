import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetOGInfoQuery } from "@/app/services/message";
import { upsertOG } from "@/app/slices/footprint";
import { useAppSelector } from "@/app/store";


export default function URLPreview({ url = "" }) {
  const dispatch = useDispatch();
  const [favicon, setFavicon] = useState("");
  const [getInfo, { isLoading }] = useLazyGetOGInfoQuery();
  const ogData = useAppSelector(store => store.footprint.og[url]);
  const [data, setData] = useState<{ title: string; description: string; ogImage: string } | null>(
    null
  );
  useEffect(() => {
    if (ogData) {
      let defaultFavIcon = "";
      try {
        defaultFavIcon = `${new URL(url).origin}/favicon.ico`;
      } catch {
        defaultFavIcon = `${location.origin}/favicon.ico`;
      }
      const title = ogData?.title || ogData?.site_name || "";
      const description = ogData?.description || "";
      const ogImage = ogData?.images.find((i) => !!i.url)?.url || "";
      const favicon = ogData?.favicon_url || defaultFavIcon;
      setFavicon(favicon);
      setData({ title, description, ogImage });
    } else if (url) {
      // fetch first
      getInfo(url);
    }
  }, [url, ogData]);
  // const handleFavError = () => {
  //   setFavicon("");
  // };
  const handleOGImageError = () => {
    dispatch(upsertOG({ key: url, value: { ...ogData, images: [] } }));
  };
  if (isLoading) return <div className="h-28"></div>;
  if (!url || !data || !data.title) return null;
  const { title, description, ogImage } = data;

  const containerClass = `flex items-center border border-solid border-gray-300 dark:border-gray-600 box-border rounded-md w-[80%] md:w-[380px]`;

  return ogImage ? (
    // 简版
    <a className={`${containerClass} flex-col !items-start p-3`} href={url} target="_blank" rel="noreferrer">
      <h3 className={`text-primary-500 w-full truncate`}>{title}</h3>
      <p className={`text-xs text-gray-400 mb-2 w-full truncate`}>{description}</p>
      <div className="w-full h-[180px]">
        <img className="w-full h-full object-cover" onError={handleOGImageError} src={ogImage} alt="og image" />
      </div>
    </a>
  ) : (
    // 带图详情
    <a
      className={`${containerClass} gap-2  px-2 py-3`}
      href={url} target="_blank" rel="noreferrer">
      {favicon && (
        <div className="flex rounded">
          <img className="object-contain w-12 h-12" src={favicon} alt="favicon" />
        </div>
      )}
      <div className="flex flex-col">
        <h3 className="text-sm text-gray-900 dark:text-gray-100">{title}</h3>
        <p className={`hidden md:block text-xs text-gray-500 dark:text-gray-400 w-[288px] truncate`}>{description}</p>
        <span className={`text-[10px] text-gray-500 w-[288px] truncate`}>{url}</span>
      </div>
    </a>
  );
}
