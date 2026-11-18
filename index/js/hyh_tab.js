/**
 * 选项卡通用组件（可复用）
 * DOM查找方式
 * 1.按照类选择器名称查找：getElementsByClassName
 * 2.按照标签选择器名称查找：getElementsByTagName
 * 3.按照选择器查找：返回第一个匹配元素：querySelector、querySelectorAll、getElementById
 * 4.按照属性值查找：getAttribute、getAttributeNS
 * 
 * 用法：给容器加 data-hyh-tabs，内部放 .hyh_tab（按钮）与 .hyh_panel（面板），
 *      按钮的 data-hyh-tab 与面板的 data-hyh-panel 取值一一对应。
 */
(function () {
  // 清除容器内所有选项卡与面板的选中状态
  function hyh_clearTabs(hyh_root) {
    hyh_root.querySelectorAll('.hyh_tab').forEach(function (hyh_tab) {
      hyh_tab.classList.remove('hyh_is_active');
      hyh_tab.setAttribute('aria-selected', 'false');
      hyh_tab.setAttribute('tabindex', '-1');
    });
    hyh_root.querySelectorAll('.hyh_panel').forEach(function (hyh_panel) {
      hyh_panel.classList.remove('hyh_is_active');
      hyh_panel.hidden = true;
    });
  }

  // 激活指定选项卡：先清除全部选中状态，再设置当前按钮与其对应面板
  function hyh_activateTab(hyh_root, hyh_tab) {
    var hyh_key = hyh_tab.getAttribute('data-hyh-tab');
    hyh_clearTabs(hyh_root);

    hyh_tab.classList.add('hyh_is_active');
    hyh_tab.setAttribute('aria-selected', 'true');
    hyh_tab.setAttribute('tabindex', '0');

    var hyh_panel = hyh_root.querySelector('.hyh_panel[data-hyh-panel="' + hyh_key + '"]');
    if (hyh_panel) {
      hyh_panel.classList.add('hyh_is_active');
      hyh_panel.hidden = false;
    }
  }

  // 初始化单个选项卡容器：绑定点击监听，并显示默认选中的选项卡
  function hyh_initTabs(hyh_root) {
    var hyh_tabs = hyh_root.querySelectorAll('.hyh_tab');
    if (!hyh_tabs.length) {
      return;
    }

    hyh_tabs.forEach(function (hyh_tab) {
      hyh_tab.addEventListener('click', function () {
        hyh_activateTab(hyh_root, hyh_tab);
      });
    });

    // 优先使用标记为默认的按钮，否则回退到第一个
    var hyh_default = hyh_root.querySelector('.hyh_tab[data-hyh-default="true"]') || hyh_tabs[0];
    hyh_activateTab(hyh_root, hyh_default);
  }

  // 页面加载完成后自动初始化所有带 data-hyh-tabs 的容器
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-hyh-tabs]').forEach(hyh_initTabs);
  });
})();
