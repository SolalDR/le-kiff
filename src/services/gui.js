import * as dat from "dat.gui";
import "three-dat.gui";

var gui = new dat.GUI({
  load: JSON,
});

export const guiMicro = gui.addFolder("Micro");
export const guiMacro = gui.addFolder("Macro");
export const guiMuman = gui.addFolder("Human");
export const guiRendering = gui.addFolder("Rendering");
export const guiChapter1 = gui.addFolder("Chapter 1");
// export const guiChapter2 = gui.addFolder("Chapter 2");
// export const guiChapter3 = gui.addFolder("Chapter 3");
// export const guiChapter4 = gui.addFolder("Chapter 4");

export default gui; 
