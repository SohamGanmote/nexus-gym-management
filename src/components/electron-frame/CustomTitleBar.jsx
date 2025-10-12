import { CodeXml, Dumbbell } from "lucide-react";
import { handleClose, handleMaximize, handleMinimize } from "../../connect-to-db/renderer";
const { shell } = window.require("electron");

const CustomTitleBar = () => {
  const openGithub = () => {
    shell.openExternal("https://github.com/SohamGanmote/nexus-gym-management");
  };
  return (
    <div
      className="flex items-center justify-between bg-black text-gray-100 h-10 px-3 select-none sticky top-0"
      style={{ WebkitAppRegion: "drag", zIndex: 1000 }}
    >
      <div className="flex items-center justify-center gap-3">
        <Dumbbell className="w-5 h-5" strokeWidth={2} />
        <p className="text-sm font-medium tracking-wide">Nexus Gym Management</p>
      </div>
      <div className="flex -mr-3" style={{ WebkitAppRegion: "no-drag" }}>
        <div className="w-10 flex items-center justify-center border-r border-gray-500 my-2">
          <CodeXml
            className="w-5 h-5 cursor-pointer hover:text-gray-400"
            strokeWidth={2}
            onClick={openGithub}
          />
        </div>
        <button
          onClick={handleMinimize}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-700"
        >
          &#8211;
        </button>
        <button
          onClick={handleMaximize}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-700"
        >
          ☐
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CustomTitleBar;
