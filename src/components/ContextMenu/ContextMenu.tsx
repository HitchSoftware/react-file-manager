// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/ContextMenu/ContextMenu.tsx

import React, { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import SubMenu from "./SubMenu";
import "./ContextMenu.scss";

interface ContextMenuItem {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  children?: ContextMenuItem[];
  divider?: boolean;
  hidden?: boolean;
}

interface ContextMenuProps {
  filesViewRef: React.RefObject<HTMLElement>;
  contextMenuRef: React.RefObject<HTMLDivElement>;
  menuItems: ContextMenuItem[];
  visible: boolean;
  clickPosition: { clickX: number; clickY: number };
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  filesViewRef,
  contextMenuRef,
  menuItems,
  visible,
  clickPosition,
}) => {
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<number | null>(null);
  const [subMenuPosition, setSubMenuPosition] = useState<"left" | "right">("right");

  const subMenuRef = useRef<HTMLDivElement | null>(null);

  const contextMenuPosition = () => {
    const { clickX, clickY } = clickPosition;

    const container = filesViewRef.current;
    const menu = contextMenuRef.current;

    if (!container || !menu) return;

    const containerRect = container.getBoundingClientRect();
    const scrollBarWidth = container.offsetWidth - container.clientWidth;

    const contextMenuRect = menu.getBoundingClientRect();
    const menuWidth = contextMenuRect.width;
    const menuHeight = contextMenuRect.height;

    const leftToCursor = clickX - containerRect.left;
    const hasRightSpace = containerRect.width - (leftToCursor + scrollBarWidth) > menuWidth;
    const hasBottomSpace = containerRect.height - (clickY - containerRect.top) > menuHeight;

    if (hasRightSpace) {
      setLeft(leftToCursor);
      setSubMenuPosition("right");
    } else {
      setLeft(leftToCursor - menuWidth);
      setSubMenuPosition("left");
    }

    if (hasBottomSpace) {
      setTop(clickY - containerRect.top + container.scrollTop);
    } else {
      setTop(clickY - containerRect.top + container.scrollTop - menuHeight);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseOver = (index: number) => {
    setActiveSubMenuIndex(index);
  };

  useEffect(() => {
    if (visible && contextMenuRef.current) {
      contextMenuPosition();
    } else {
      setTop(0);
      setLeft(0);
      setActiveSubMenuIndex(null);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={contextMenuRef}
      onContextMenu={handleContextMenu}
      onClick={(e) => e.stopPropagation()}
      className={`fm-context-menu visible`}
      style={{ top, left }}
    >
      <div className="file-context-menu-list">
        <ul>
          {menuItems
            .filter((item) => !item.hidden)
            .map((item, index) => {
              const hasChildren = !!item.children;
              const activeSubMenu = activeSubMenuIndex === index && hasChildren;

              return (
                <div key={item.title}>
                  <li
                    onClick={item.onClick}
                    className={`${item.className ?? ""} ${activeSubMenu ? "active" : ""}`}
                    onMouseOver={() => handleMouseOver(index)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {hasChildren && (
                      <>
                        <FaChevronRight size={14} className="list-expand-icon" />
                        {activeSubMenu && (
                          <SubMenu
                            subMenuRef={subMenuRef}
                            list={item.children}
                            position={subMenuPosition}
                          />
                        )}
                      </>
                    )}
                  </li>
                  {item.divider && <div className="divider"></div>}
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
