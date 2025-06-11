import "./FilePreview.sass";

import { FC } from "react";
import { useTranslation } from "i18nano";
import { downloadFile } from "utils";

import { Caption, Text } from "uikit";

import { type ProcessingFileResponse } from "models";
import { type DndFilesState } from "store/dndFiles/interface";

import { IconDownload, IconFile, IconZipped } from "assets/icons";

interface FilePreviewProps {
  file: DndFilesState["files"][0];
}

const FilePreview: FC<FilePreviewProps> = (props) => {
  const t = useTranslation();
  const processing = "Processing...";

  const getName = (): { name: string; extension: string } => {
    const parts = props.file.file.name.split(".");
    const extension = parts.pop() || "";
    const name = parts.join(".");
    return { name, extension: `.${extension}` };
  };

  const getSize = (type: keyof ProcessingFileResponse["file"]["size"]) => {
    const size = props.file.processed?.file.size[type];
    if (size) {
      return `${type === "compressed" ? ".zlottie" : ".json"} (${(size / 1024).toFixed(1)} KB)`;
    }

    return processing.toLowerCase();
  };

  const handleDownloadFile = (type: keyof ProcessingFileResponse["data"]) => {
    const file = props.file.processed?.data[type];
    if (file) {
      const name = getName().name;
      downloadFile(file, name, type === "default" ? "json" : "zlottie");
    }
  };

  return (
    <div className="FilePreview">
      <div className="FilePreview__text">
        <IconFile
          className="FilePreview__icon"
          width={24}
          height={24}
          color={"var(--accent)"}
        />
        <div>
          <Text className="FilePreview__caption">
            {getName().name || processing}
          </Text>
          <Caption>
            {getSize("default")} {" | "}
            {getSize("compressed")}
          </Caption>
        </div>
      </div>
      <div className="FilePreview__btn">
        <a
          className="FilePreview__btn-json"
          onClick={() => handleDownloadFile("default")}
        >
          <Caption className="FilePreview__tooltip">
            {t("home.files.download.json")}
          </Caption>
          <IconDownload width={20} height={20} />
        </a>
        <a
          className="FilePreview__btn-zlottie"
          onClick={() => handleDownloadFile("compressed")}
        >
          <Caption className="FilePreview__tooltip">
            {t("home.files.download.zlottie")}
          </Caption>
          <IconZipped width={20} height={20} />
        </a>
      </div>
    </div>
  );
};

export default FilePreview;
