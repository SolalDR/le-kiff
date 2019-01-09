import * as dat from "dat.gui";
import "three-dat.gui";

var gui = new dat.GUI();

export const guiMicro = gui.addFolder("Micro");
export const guiMacro = gui.addFolder("Macro");
export const guiMuman = gui.addFolder("Human");
export const guiRendering = gui.addFolder("Rendering");

export default gui; 
