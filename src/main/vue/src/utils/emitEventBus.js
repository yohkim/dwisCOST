/**
 * 탭이동 이벤트
 */
export function emitTabEvent(menu, event) {
	if (menu.url && menu.url.includes("?tab")) {
    const params = new URLSearchParams(menu.url.split("?")[1]);
    const tabValue = params.get("tab");
    event.emit("change-tab-" + menu.menuId, tabValue.toUpperCase());
  }
}