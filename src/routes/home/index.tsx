import { memo, useEffect } from "react";
import { Outlet, NavLink, useLocation, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import User from "./User";
import Loading from "@/components/Loading";
import Menu from "./Menu";
import usePreload from "@/hooks/usePreload";
import Tooltip from "@/components/Tooltip";
import Notification from "@/components/Notification";
import Manifest from "@/components/Manifest";
import ChatIcon from "@/assets/icons/chat.svg";
import UserIcon from "@/assets/icons/user.svg";
import FavIcon from "@/assets/icons/bookmark.svg";
import FolderIcon from "@/assets/icons/folder.svg";
import { useAppSelector } from "@/app/store";
import MobileNavs from "./MobileNavs";
import { updateRememberedNavs } from "@/app/slices/ui";
import UnreadTabTip from "@/components/UnreadTabTip";
import ReLoginModal from "@/components/ReLoginModal";
import Voice from "@/components/Voice";
import ServerVersionChecker from "@/components/ServerVersionChecker";


function HomePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isHomePath = useMatch(`/`);
  const isChatHomePath = useMatch(`/chat`);
  const { pathname } = useLocation();
  const {
    roleChanged,
    loginUser: { uid: loginUid },
    guest,
    ui: {
      ready,
      rememberedNavs: { chat: chatPath, user: userPath }
    }
  } = useAppSelector((store) => {
    return {
      ui: store.ui,
      loginUser: store.authData.user ?? { uid: 0, is_admin: false },
      guest: store.authData.guest,
      roleChanged: store.authData.roleChanged
    };
  });
  const { success } = usePreload();
  useEffect(() => {
    if (isChatHomePath) {
      dispatch(updateRememberedNavs({ key: "chat", path: "/chat" }));
    }
  }, [isChatHomePath]);

  if (!success || !ready) {
    return <Loading reload={true} fullscreen={true} />;
  }
  const isSettingPage = pathname.startsWith("/setting");
  const isChattingPage = isHomePath || pathname.startsWith("/chat");
  if (isSettingPage) {
    return <Outlet />;
  }
  // 有点绕
  const chatNav = isChatHomePath ? "/chat" : chatPath || "/chat";
  // console.log("navvvv", isChatHomePath, chatPath);
  const userNav = userPath || "/users";
  const linkClass = `flex items-center gap-2.5 px-3 py-2 font-semibold text-sm text-gray-600 rounded-lg md:hover:bg-gray-800/10`;
  return (
    <>
      {roleChanged && <ReLoginModal />}
      {!guest && <UnreadTabTip />}
      {!guest && <ServerVersionChecker empty={true} version="0.3.5">
        <Voice />
      </ServerVersionChecker>}
      <Manifest />
      {!guest && <Notification />}
      <div className={`vocechat-container flex w-screen h-screen bg-gray-200 dark:bg-gray-900`}>
        {!guest && (
          <div className={`hidden md:flex h-full flex-col items-center relative w-16 bg-gray-200 dark:bg-gray-900 transition-all`}>
            {loginUid && <User uid={loginUid} />}
            <nav className="flex flex-col gap-1 px-3 py-6">
              <NavLink
                className={({ isActive }) => `${linkClass} ${(isActive || isChattingPage) ? "bg-primary-400 md:hover:bg-primary-400" : ""}`}
                to={chatNav}
              >
                {({ isActive }) => {
                  return <Tooltip tip={t("chat")}>
                    <ChatIcon className={(isActive || isChattingPage) ? "fill-white" : ""} />
                  </Tooltip>;
                }}
              </NavLink>
              <NavLink className={({ isActive }) => `${linkClass} ${isActive ? 'bg-primary-400 md:hover:bg-primary-400' : ""}`} to={userNav}>
                {({ isActive }) => {
                  return <Tooltip tip={t("members")}>
                    <UserIcon className={isActive ? "fill-white" : ""} />
                  </Tooltip>;
                }}
              </NavLink>
              <NavLink className={({ isActive }) => `${linkClass} ${isActive ? 'bg-primary-400 md:hover:bg-primary-400' : ""}`} to={"/favs"}>
                {({ isActive }) => {
                  return <Tooltip tip={t("favs")}>
                    <FavIcon className={isActive ? "fill-white" : ""} />
                  </Tooltip>;
                }}
              </NavLink>
              <NavLink className={({ isActive }) => `${linkClass} ${isActive ? 'bg-primary-400 md:hover:bg-primary-400' : ""}`} to={"/files"}>
                {({ isActive }) => {
                  return <Tooltip tip={t("files")}>
                    <FolderIcon className={isActive ? "fill-white" : ""} />
                  </Tooltip>;
                }}
              </NavLink>
            </nav>
            <Menu />
          </div>
        )}
        <div className="h-full flex flex-col w-full">
          <Outlet />
        </div>
      </div>
      {!guest && <MobileNavs />}
    </>
  );
}
export default memo(HomePage);
