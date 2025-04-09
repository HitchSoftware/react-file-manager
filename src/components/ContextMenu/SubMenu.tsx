// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/ContextMenu/SubMenu.tsx

import React from "react";
import { FaCheck } from "react-icons/fa6";

interface SubMenuItem {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

interface SubMenuProps {
  subMenuRef: React.RefObject<HTMLUListElement>;
  list: SubMenuItem[];
  position?: "left" | "right";
}

const SubMenu: React.FC<SubMenuProps> = ({ subMenuRef, list, position = "right" }) => {
  return (
    <ul ref={subMenuRef} className={`sub-menu ${position}`}>
      {list.map((item) => (
        <li key={item.title} onClick={item.onClick}>
          <span className="item-selected">{item.selected && <FaCheck size={13} />}</span>
          {item.icon}
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default SubMenu;
