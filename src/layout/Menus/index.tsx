import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BuildOutlined,
  FormatPainterOutlined,
  PlayCircleOutlined,
  LineChartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useDebounceFn } from "ahooks";
import { Button, Menu } from "antd";
import type { MenuProps } from "antd";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import styles from "./index.module.less";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <p className={styles.menuLabel}>{label}</p>,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Html视觉", "html", <BuildOutlined />, [
    getItem("视觉设计", "visualDesign"),
    getItem("交互设计", "interactiveDesign"),
    getItem("背景效果", "backgroundEffect"),
    getItem("复杂布局", "complexLayout"),
    getItem("应用页面框架", "appPageFrame"),
  ]),
  getItem("CSS动效", "css", <FormatPainterOutlined />, [
    getItem("动效按钮", "dynamicButtons"),
    getItem("丰富动效", "richDynamicEffect"),
  ]),
  getItem("Canvas动效", "canvas", <PlayCircleOutlined />, [
    getItem("动态时钟", "dynamicClock"),
    getItem("探照灯效果", "searchlight"),
    getItem("球体碰撞交互效果", "globuleInteraction"),
    getItem("消灭行星小游戏", "killPlanetGame"),
    getItem("球体自由落体交互效果", "freeFallingBody"),
    getItem("炫酷倒计时动画", "countDown"),
    getItem("动态粒子背景", "particlesBg"),
  ]),
  getItem("Echarts交互", "echarts", <LineChartOutlined />, [
    getItem("柱状图", "bar"),
    getItem("饼图", "pie"),
    getItem("敬请期待", "echartsComingSoon"),
  ]),
  getItem("Three.js3D", "threejs", <RocketOutlined />, [
    getItem("敬请期待", "threejsComingSoon"),
  ]),
];

const Menus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const globalContext = useGlobalContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMenuWidth = useCallback(
    useDebounceFn(
      () => {
        const containerNode = ReactDOM.findDOMNode(
          containerRef.current
        ) as HTMLDivElement;
        if (containerNode) {
          globalContext.setMenuWidth(containerNode.clientWidth);
        }
      },
      { wait: 360 }
    ).run,
    []
  );

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMenu = (options: { keyPath: string[] }) => {
    const { keyPath } = options;
    const routePath = keyPath.reduce((result, item) => {
      result = `/${item}${result}`;
      return result;
    }, "");
    navigate(routePath);
  };

  const selectedKeys = useMemo(() => {
    const { pathname } = location;
    const result = [];
    if (pathname) {
      const arr = pathname.split("/");
      const key = arr[arr.length - 1];
      if (key) {
        result.push(key);
      }
    }
    return result;
  }, [location]);

  useEffect(() => {
    updateMenuWidth();
  }, [collapsed]);

  useEffect(() => {
    window.addEventListener("resize", updateMenuWidth);

    return () => {
      window.removeEventListener("resize", updateMenuWidth);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.top}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      <Menu
        defaultOpenKeys={["html", "css", "canvas", "echarts"]}
        selectedKeys={selectedKeys}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onClick={onMenu}
      />
    </div>
  );
};

export default Menus;
