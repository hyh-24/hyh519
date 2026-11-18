/**
 * 影视排行榜选项卡组件
 * 作者：黄煜涵
 * 建立时间：2026-11-04
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：影视排行榜选项卡
 */
(function () {
  // 黄煜涵：四个选项卡对应的排行榜数据，数组顺序即名次（1-10）
  var hyh_rankData = {
    daily: [
      '最美的时光', '咱们结婚吧', '渗透', '继承者们', '烽火佳人',
      '极品女士第2季', '爱闪亮', '狼烟（2013）', '钱多多炼爱记', '苍狼'
    ],
    weekly: [
      '咱们结婚吧', '继承者们', '最美的时光', '爱闪亮', '渗透',
      '狼烟（2013）', '三十岁，你好', '钱多多炼爱记', '特种兵之火凤凰', '极品女士第2季'
    ],
    monthly: [
      '特种兵之火凤凰', '咱们结婚吧', '继承者们', '金玉满堂', '王的女人',
      '爱闪亮', '爱情面前谁怕谁', '英雄联盟', '小爸爸', '我们这拨人'
    ],
    all: [
      '永不磨灭的番号', '特种兵之火凤凰', '新还珠格格', '咱们结婚吧', '小爸爸',
      '心术', '乡村爱情5', '天天有喜', '一不小心爱上你', '夏日甜心'
    ]
  };

  // 黄煜涵：生成单个名次条目，前三名使用红色徽章，其余为灰色徽章
  function hyh_buildRankItem(hyh_name, hyh_index) {
    var hyh_item = document.createElement('li');
    hyh_item.className = 'hyh_rank_item';

    var hyh_num = document.createElement('span');
    hyh_num.className = 'hyh_rank_num' + (hyh_index < 3 ? ' hyh_rank_num_top' : '');
    hyh_num.textContent = String(hyh_index + 1);

    var hyh_title = document.createElement('span');
    hyh_title.className = 'hyh_rank_name';
    hyh_title.textContent = hyh_name;

    hyh_item.appendChild(hyh_num);
    hyh_item.appendChild(hyh_title);
    return hyh_item;
  }

  // 黄煜涵：把数据渲染成左右两列（左列 1-5 名，右列 6-10 名）
  function hyh_renderRankPanel(hyh_type) {
    var hyh_panel = document.createElement('div');
    hyh_panel.className = 'hyh_rank_panel';
    hyh_panel.setAttribute('data-hyh-panel', hyh_type);

    var hyh_data = hyh_rankData[hyh_type] || [];
    var hyh_columns = [hyh_data.slice(0, 5), hyh_data.slice(5, 10)];

    hyh_columns.forEach(function (hyh_names, hyh_colIndex) {
      var hyh_list = document.createElement('ul');
      hyh_list.className = 'hyh_rank_list';

      hyh_names.forEach(function (hyh_name, hyh_rowIndex) {
        hyh_list.appendChild(hyh_buildRankItem(hyh_name, hyh_colIndex * 5 + hyh_rowIndex));
      });

      hyh_panel.appendChild(hyh_list);
    });

    return hyh_panel;
  }

  // 黄煜涵：清除容器内所有选项卡与面板的选中状态
  function hyh_clearRankTabs(hyh_root) {
    hyh_root.querySelectorAll('.hyh_rank_tab').forEach(function (hyh_tab) {
      hyh_tab.classList.remove('hyh_is_active');
    });
    hyh_root.querySelectorAll('.hyh_rank_panel').forEach(function (hyh_panel) {
      hyh_panel.classList.remove('hyh_is_active');
    });
  }

  // 黄煜涵：切换选项卡——先清除所有选中状态，再设置当前选项卡与对应面板
  function hyh_switchRankTab(hyh_root, hyh_tab) {
    var hyh_type = hyh_tab.getAttribute('data-hyh-tab');
    hyh_clearRankTabs(hyh_root);

    hyh_tab.classList.add('hyh_is_active');
    var hyh_panel = hyh_root.querySelector('.hyh_rank_panel[data-hyh-panel="' + hyh_type + '"]');
    if (hyh_panel) {
      hyh_panel.classList.add('hyh_is_active');
    }
  }

  // 黄煜涵：初始化排行榜——渲染四个面板、绑定点击事件并默认选中「每日」
  function hyh_initRankTabs(hyh_root) {
    var hyh_panelBox = hyh_root.querySelector('.hyh_rank_panels');
    var hyh_tabs = hyh_root.querySelectorAll('.hyh_rank_tab');

    hyh_tabs.forEach(function (hyh_tab) {
      var hyh_type = hyh_tab.getAttribute('data-hyh-tab');
      hyh_panelBox.appendChild(hyh_renderRankPanel(hyh_type));

      // 黄煜涵：点击时先清空全部选中态，再激活当前选项卡
      hyh_tab.addEventListener('click', function () {
        hyh_switchRankTab(hyh_root, hyh_tab);
      });
    });

    hyh_switchRankTab(hyh_root, hyh_tabs[0]);
  }

  // 黄煜涵：页面加载完成后初始化页面上所有排行榜容器
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-hyh-rank]').forEach(hyh_initRankTabs);
  });
})();
