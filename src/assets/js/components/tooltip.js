import { getPageSide } from "../scripts/core/helpers";

/* 
  ================================================
	  
  Тултипы 
	
  ================================================
*/

export function tooltip() {
  const timers = new WeakMap();

  const getTooltip = (item) => {
    let tooltip;
    const tooltipIsHtml = item.getAttribute("data-tooltip") === "html";

    if (tooltipIsHtml) {
      tooltip = item.querySelector(".tooltip");
    } else {
      tooltip = item.querySelector(".tooltip");

      if (!tooltip) {
        let text = "";

        if (item.hasAttribute("title")) {
          text = item.getAttribute("title");
          item.removeAttribute("title");
        } else if (item.getAttribute("data-tooltip") !== "") {
          text = item.getAttribute("data-tooltip");
        }

        tooltip = document.createElement("span");
        tooltip.className = "tooltip";
        tooltip.textContent = text;
        item.append(tooltip);
      }
    }

    return tooltip;
  };

  const calculatePosTooltip = (item, tooltip) => {
    tooltip.style.left = "";
    tooltip.style.right = "";

    if (getPageSide(item) === "left") {
      tooltip.style.left = "0";
    } else {
      tooltip.style.right = "0";
    }

    tooltip.style.bottom = item.offsetHeight + "px";
  };

  const showTooltip = (item) => {
    const tooltip = getTooltip(item);
    if (!tooltip) return;

    clearTimeout(timers.get(item));
    calculatePosTooltip(item, tooltip);
    tooltip.classList.add("tooltip_active");
  };

  const hideTooltip = (item) => {
    const tooltip = item.querySelector(".tooltip");
    if (!tooltip) return;

    const timer = setTimeout(() => {
      tooltip.classList.remove("tooltip_active");
    }, 200);

    timers.set(item, timer);
  };

  const getItemFromEvent = (e) => {
    if (!(e.target instanceof Element)) return null;
    return e.target.closest("[data-tooltip]");
  };

  document.addEventListener(
    "mouseenter",
    (e) => {
      const item = getItemFromEvent(e);
      if (!item) return;

      showTooltip(item);
    },
    true
  );

  document.addEventListener(
    "mouseleave",
    (e) => {
      const item = getItemFromEvent(e);
      if (!item) return;

      hideTooltip(item);
    },
    true
  );

  document.addEventListener("focusin", (e) => {
    const item = getItemFromEvent(e);
    if (!item) return;

    showTooltip(item);
  });

  document.addEventListener("focusout", (e) => {
    const item = getItemFromEvent(e);
    if (!item) return;

    hideTooltip(item);
  });

  document.addEventListener("mouseover", (e) => {
    if (!(e.target instanceof Element)) return;

    const tooltip = e.target.closest(".tooltip");
    if (!tooltip) return;

    const item = tooltip.closest("[data-tooltip]");
    if (!item) return;

    clearTimeout(timers.get(item));
  });

  document.addEventListener("mouseout", (e) => {
    if (!(e.target instanceof Element)) return;

    const tooltip = e.target.closest(".tooltip");
    if (!tooltip) return;

    tooltip.classList.remove("tooltip_active");
  });
}
