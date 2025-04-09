// REPO: @hitchsoftware/react-file-manager
// FILE: src/FileManager/FileList/FilesHeader.tsx

import { useMemo, useState } from "react";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useSelection } from "../../contexts/SelectionContext";
import { useFileNavigation } from "../../contexts/FileNavigationContext";

interface FilesHeaderProps {
  unselectFiles: () => void;
}

const FilesHeader: React.FC<FilesHeaderProps> = ({ unselectFiles }) => {
  const [showSelectAll, setShowSelectAll] = useState<boolean>(false);

  const { selectedFiles, setSelectedFiles } = useSelection();
  const { currentPathFiles } = useFileNavigation();

  const allFilesSelected = useMemo(() => {
    return currentPathFiles.length > 0 && selectedFiles.length === currentPathFiles.length;
  }, [selectedFiles, currentPathFiles]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles(currentPathFiles);
      setShowSelectAll(true);
    } else {
      unselectFiles();
    }
  };

  return (
    <div
      className="files-header"
      onMouseOver={() => setShowSelectAll(true)}
      onMouseLeave={() => setShowSelectAll(false)}
    >
      <div className="file-select-all">
        {(showSelectAll || allFilesSelected) && (
          <Checkbox
            checked={allFilesSelected}
            onChange={handleSelectAll}
            title="Select all"
            disabled={currentPathFiles.length === 0}
          />
        )}
      </div>
      <div className="file-name">Name</div>
      <div className="file-date">Modified</div>
      <div className="file-size">Size</div>
    </div>
  );
};

export default FilesHeader;
