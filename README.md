# AETHER · 静默科技 — DSH 皮肤插件

一款为 DSH Web GUI 设计的未来科技感皮肤。核心判断：**未来感来自秩序与克制的光，而不是堆叠特效**。
深空黑底、银灰金属、1px 发丝线、极淡氛围光；所有色彩走 DSH 的 alias 令牌，因此整站（侧栏、会话、输入框、菜单、代码块、滚动条、焦点环）一次性统一，且浅色/深色两套自动跟随系统。

- 包名：`@local/dsh-aether-skin`
- 形态：always-on 皮肤（安装即生效）+ 设置页控制台（可即时关闭、换强调色、关氛围层与星河、调星河浓度、开关玻璃立体平台）
- 实现层级：`theme.overrideTokens()`（配色）→ 注入样式表（细节）→ `shell.overlay`（氛围层 + 星河背景）→ 运行时标记宿主侧栏（玻璃立体平台）→ `settings.section`（控制台）

---

## 0. 安装与使用

**要求**：DSH Web GUI。插件依赖宿主客户端的两项能力——`theme.overrideTokens()`（主题令牌覆盖）与 client slots（`shell.overlay` / `settings.section`）；本版本在 `@deepseek-ai/dsh-client-ui-theme@0.2.2-rc.1` 上开发和验证。

1. 克隆仓库到本地任意目录：

   ```bash
   git clone https://github.com/miaoguoqing/dsh-aether-skin.git
   ```

2. 在 DSH 里以 **本地 bundle** 方式安装：插件管理 → 安装本地 bundle → 选中 `dsh-aether-skin/` 目录。
   等价做法是把 `"@local/dsh-aether-skin"` 写进当前 profile 的 `dsh.profile.bundles`，并在该 profile 的 `dependencies` 里加 `"link:/绝对路径/dsh-aether-skin"`。
3. **刷新 GUI**（客户端插件代码在页面加载时求值，首次安装后必须刷新一次）。
4. 进入设置页的 **AETHER** 一页：可以整体关闭皮肤、切换强调色（冰蓝 / 薄荷 / 琥珀）、开关氛围层与星河背景、调整星河浓度（隐约 / 标准 / 浓郁）、开关玻璃立体平台。偏好保存在 `localStorage["dsh-aether-skin.v1"]`。

**卸载**：在插件管理里移除 `@local/dsh-aether-skin`（或删除 profile 里对应的 bundle 与 dependency），刷新即可；`localStorage` 中的偏好可留可清。

**开发调试**：本包用 `link:` 方式安装，改完 `client.js` 刷新页面即生效，不需要重新安装。

> 📷 本仓库暂未附带 GUI 实机截图（开发环境没有浏览器截图能力）。欢迎提交 PR 补充浅色 / 深色 / 星河的实机截图。

---

## 1. 设计定位

| 维度 | 取向 |
| --- | --- |
| 气质 | 仪器感、静默、精确；像高端实验室的显示器，而不是游戏 HUD |
| 对比 | 主体近黑，层级靠 1px 冷灰线与微弱色阶，不靠重投影 |
| 光 | 只出现在三个地方：焦点环、悬停态、在线状态点 |
| 密度 | 8pt 栅格 + 大留白；信息分块用间距，不用色块分隔 |
| 动效 | 只有状态反馈，没有装饰性循环动画 |

---

## 2. 配色方案

### 2.1 深空（深色，默认）

| 角色 | 令牌 | 值 |
| --- | --- | --- |
| 基底 | `bg-base` | `#05070A` |
| 面板 | `bg-layer-1` | `#0A0E14` |
| 次级面板 | `bg-layer-2` | `#11161E` |
| 浮起面 | `bg-layer-3` | `#171E28` |
| 发丝线 | `border-l1/l2/l3/l4` | `#141B24` / `#1D2530` / `#2A3442` / `#3B4859` |
| 主文字 | `label-primary` | `#F2F5F9` |
| 次文字 | `label-secondary` | `#AEB9C8` |
| 三级文字 | `label-tertiary` | `#7C8798` |
| 弱文字 | `label-caption` | `#545F70` |
| 银灰强调 | `brand-primary` | `#C5CED9` |
| 主按钮 | `button-primary-fill` | 金属渐变（见下） |

### 2.2 银砂（浅色）

`bg-base #F2F4F8` · `surface #FFFFFF` · `line #DDE2EA / #C5CED9` · `text #0B1016 / #45505F` · 主按钮改为深石墨金属渐变（浅色下金属必须是"深色金属"才有分量）。

### 2.3 金属渐变（全皮肤唯一的"发光"材质）

```
深色主按钮：linear-gradient(180deg, #FFFFFF 0%, #EEF3FA 42%, #C3D0E2 100%)   /* ice */
浅色主按钮：linear-gradient(180deg, #2C3846 0%, #161D27 55%, #10161E 100%)
```
只用于 `button-primary-fill` / `button-primary-hover`。原因：宿主用 `background:` 简写绘制主按钮、用 `color: var(--dsw-alias-label-primary-foreground)` 决定文字色，因此渐变安全、且明暗对比稳定。
`brand-primary`（开关、checkbox、加载环、focus fallback）**保持纯色**，避免把渐变塞进 `conic-gradient` / `accent-color` 导致降级。

### 2.4 强调色三轨（同一套皮肤的不同"温度"）

| 轨道 | 深色 | 浅色 | 用途 |
| --- | --- | --- | --- |
| Ice 冰蓝（默认） | `#8FC7FF` | `#1E66C9` | 链接、焦点、业务状态 |
| Mint 薄荷 | `#7FE3BE` | `#0E7A55` | 同上，偏冷绿 |
| Amber 琥珀 | `#E8C176` | `#A96A0C` | 同上，偏暖金 |

强调色只进入 `link / state-business / focus-ring / brand-primary-new / button-info` 与其 tertiary 背景，**不做整面底纹**——这是"简洁不复杂"的硬约束。

### 2.5 语义色

成功 `#72D6A9`（浅 `#1F8F63`）· 警告 `#E8C176`（浅 `#B57311`）· 危险 `#F18585`（浅 `#C23B3B`）· 完成 `#B8A6FF`（浅 `#6D4AE0`）。
均按"深色亮、浅色深"取反，保证两种模式都 ≥ 4.5:1（按底色实测）。

---

## 3. 视觉元素

1. **发丝线**：全局 1px（.5px 在高分屏）冷灰线定义层次；不用 box-shadow 堆层级。卡片、设置行、分组、表格全部同一条线。
2. **微光**：`shell.overlay` 一层 `pointer-events:none` 的氛围层——顶部 120%×62% 的冷光 + 右下角 72%×52% 的银灰反光 + 内阴影晕影，透明度 5–7%。它永不拦截点击、不改变布局，关闭开关即完全消失。
3. **星河**：同一条 `shell.overlay` 里的第二个 click-through 图层（`.ae-sky`）——一条斜向银河带 + 两套矢量星点；深色下用 `screen` 混合只提亮暗部，浅色下切 `multiply` 变成银灰薄雾，星点自动隐去。详见 §3.1。
4. **玻璃立体平台**：左侧工作区不再贴边，而是内缩成一块圆角玻璃板——背景模糊 + 半透明白/银渐变 + 1px 高光环 + 柔和投影；其中每一行会话/工作区是一张轻微浮起的卡片。详见 §3.2。
5. **点阵**：控制台预览卡用 12px 点阵底纹（`radial-gradient(var(--dsw-alias-border-l1) 1px,transparent 1px)`），暗示「图纸/网格」，但只出现在自己的组件里。
6. **无噪点贴图**：放弃 grain 纹理——那会牺牲文字清晰度，与「清晰易读」冲突。
7. **留白**：设置页行距 16px 上下、分组间 26px；组件内部 10–14px。任何元素不贴边。

### 3.1 星河背景（Star river / Deep cosmos）

目标：**像隔着一层深色玻璃看星空**——看得出银河的走向、星点的疏密和远近，但任何一行文字都不受影响。星点只画「点」；最亮的几颗用两条发丝线做十字闪光，**不使用任何光晕圆盘或圆环**。

| 层 | 内容 | 深色 | 浅色 |
| --- | --- | --- | --- |
| 星云带（`.ae-sky-field` 的渐变部分） | 12 段：10 个沿银河走向排布的多色云团（青 → 蓝 → 紫 → 玫红 → 暖金，模拟恒星形成区的色温过渡）+ 1 个弥散底 + 1 条 112° 多色彩虹柔光带，峰值 alpha 0.26 | 青蓝 / 紫 / 玫红 / 暖金，`screen` 提亮暗部 | 淡青 → 淡紫，峰值 0.09，`multiply` |
| 远景星场（`.ae-sky-field` 的位图层） | 460 颗确定性矢量星点（2400×1600 viewBox，`cover`），r 0.45–1.2、alpha 0.12–0.50，3% 带十字闪光 | 清晰锐利，无模糊滤镜 | 白点在 `multiply` 下自然隐去 |
| 银河带星场（`.ae-sky-twinkle`） | 320 颗沿 `bandY()` 高斯分布的星点，只做透明度呼吸 | 17s 循环 0.34→0.88 倍 | 隐藏 |
| 前景巨星（`.ae-sky-near`） | 20 颗 r 1.9–3.2、alpha 0.60–0.95 的星，每颗带 4 芒发丝闪光；整层 190s 缓慢漂移 | 参与 `screen` | 隐藏 |

- **透明度预算**：深色 `--ae-sky-gain: .95`（未指定主题时 0.80），星点峰值 ≤ ~0.34、星云 ≤ ~0.10；浅色再乘 0.5。浓度三档（隐约 / 标准 / 浓郁 = 0.80 / 1.05 / 1.42）只放大这一个乘数，位置与密度不变。
- **清晰**：星点是矢量圆，`cover` 铺满任意分辨率；**去掉了早期版本的 `filter: blur(.6px)`**，星点与闪光都是硬边，只在星云层做柔化（渐变本身已柔）。
- **立体**：远景固定、银河带呼吸、前景巨星整层以 190s 周期平移 2% 并轻微缩放（`translate3d` + `scale`，纯合成层）——三层速度不同形成视差，中心亮、四周暗的星云分布又补一层纵深。
- **色彩**：星点用六档色温（白 / 冰蓝 `#CFE3FF` / 长春花蓝 `#B9C8FF` / 淡紫 `#E3D2FF` / 暖金 `#FFE2B8` / 玫粉 `#FFC9DE`），远景只让少数带色（避免变成彩色噪点），前景 20 颗按顺序轮满六色；十字闪光继承所在星点的颜色，所以亮星周围的光晕是有色温的。
- **性能**：3 个绘制层；只有 1 个 `opacity` 动画 + 1 个 `transform` 动画，都不触发重排/重绘；星点字段首次加载生成一次并缓存为 data URI；`prefers-reduced-motion` 下两个动画全部停用；设置页可整体关闭。
- **交互**：`.ae-sky` 及三个子层全部 `pointer-events:none`，不拦截点击、不改布局、不参与滚动。

### 3.2 玻璃立体平台（Glass platform，可选）

> **默认关闭（v1.8.0 起）**：左侧栏与右栏保持宿主原生的平面质感，不再浮起玻璃板；需要时在 `AETHER` 设置页打开「立体平台」，启用玻璃面板、面板内缩与右栏玻璃。**列表语言不受这个开关影响**（见 §3.4）：卡片、工作区色、选中反相在任何模式下都在。

目标：把左侧工作区从「贴边的列」变成**浮在界面之上的一块玻璃板**，面板比外框略小、四边留出呼吸；卡片有轻微厚度，悬停/选中时平滑抬起。全程只加视觉，不改结构、不改交互。

| 元素 | 做法 | 深色 | 浅色 |
| --- | --- | --- | --- |
| 玻璃板 `.ae-sidebar::before` | 绝对定位、`inset:0` 填满列的留白盒（四边留白由 `.ae-sidebar` 的 `margin:var(--ae-plat-gap)` 统一给出，随侧栏宽度等比缩放）、`border-radius:clamp(12px,5%,18px)`、`backdrop-filter:blur(26px) saturate(140%)`、`z-index:-1`（在内容之下） | 银白 7.5% → 0% 的斜向高光 + `specific-sidebar-fill` 76% 半透明底；1px 13% 白环 + 三层投影（`0 38px 74px -28px` / `0 14px 30px -14px` / `0 3px 8px -2px`） + 顶部内高光 + 底部内暗边 | 白 78% → 44% 斜向高光 + 侧栏底色 72%；1px 15% 墨环 + 三层蓝黑投影 + 顶部白内高光 |
| 版面内缩 `.ae-sidebar` | 列本身保留宿主 grid 轨道，只加 `padding:clamp()`（全部用百分比基准 → 随容器宽度等比缩放）+ `box-sizing:border-box`；透明背景、不裁切、不改圆角 | — | — |
| 卡片 `[data-row-key]::before` | 卡片面画在行内的 `::before` 上（`inset:1px 4px`、`border-radius:12px`、`z-index:-1`），行本身不再有 margin / 背景 / 圆角——因此左右内缩天然对称，且完全不参与宿主排版 | `bg-layer-2` 46% 半透明底 | `rgba(255,255,255,.66)` 底 |
| 悬停 | 卡片层 `translateY(-2px) scale(1.008)`（`inset` 留出的 4px 正好容纳放大量，不会被滚动区裁切）、底色提亮、投影加深 | 环提到 17% 白 | 环提到 15% 墨 |
| 选中 | **反相表面**：深色模式下卡片变成近白（`#EDF1F7`）配深墨文字（`#0A0E14`），浅色模式下变成近黑（`#12171F`）配亮字（`#F5F8FC`）；行内所有子孙 `color:inherit`，图标 `opacity:.9` | 近白 + 深墨 + 55% 白内高光 | 近黑 + 亮字 + 16% 白内高光 |
| 右栏玻璃板 `[data-rightbar-col] [data-sidebar-right-panel]` | 右栏是「轨道不是盒子」：面板绝对定位（`right:0`），**加 padding 推不动它**，所以直接给面板本身设 `top/bottom/right:var(--ae-plat-gap)` + `width:max(0px, calc(100% - var(--ae-plat-gap) * 2))`（四边等距，列宽归零时也不会溢出）+ 圆角 + 同一套玻璃材质；`fullscreen` 形态除外，保持贴边 | 同左栏玻璃材质 | 同左栏玻璃材质 |
| 右栏内容面 | `[data-dockkit-host=dock] / [data-dockkit-pane] / [data-dockkit-empty]` 背景透明，让玻璃板成为唯一表面 | — | — |
| 过渡 | `transform / box-shadow / background-color` 统一 `220ms cubic-bezier(.16,1,.3,1)` | — | — |

- **为什么是「叠加上去的风格层」而不是改 DOM**：插件只给宿主侧栏元素追加一个自有 class（`.ae-sidebar`），开关状态由一个 `body[data-ae-glass="on"]` 属性门控；宿主的手势、拖拽、键盘焦点、选中逻辑、虚拟列表全部原样工作，关掉开关即恢复原生外观。
- **布局修复（v1.2.1）**：早期版本给宿主列加了 `margin`/`overflow:hidden`/圆角，等于**在原来那块满尺寸侧栏上又画了一个框**——被裁的是原界面，新框只是浮在上面，内容没有跟着框一起缩放，于是按钮与框边沿对不上。现在改成「轨道不动、内缩只走 padding、玻璃面单独一层」：列的 grid 轨道、底部行、拖拽手柄、窗口控制点全部保持原坐标；`padding` 用 `clamp(…,%,…)` 随列宽线性变化，列内所有子元素按 100% 宽度重新排版，因此框、内容、按钮永远同一条边距基准；圆角只画在 `::before` 玻璃层上，不裁切任何内容。
- **选中反相（v1.3.1）**：会话/工作区行被选中时不再用强调色淡染，而是换成反相表面——深色主题下卡片变近白、文字变深墨；浅色主题下卡片变近黑、文字变亮。行内子元素统一 `color: inherit`，保证标题、元信息、图标一起翻转，不会出现「白底上浮着灰字」。反相表面的环与投影单独用 `--ae-card-sel-ink-*` 控制，切换主题时只换一组变量。
- **左右留白对称（v1.3.0，v1.6.1 修正）**：v1.3.0 曾给列表树补 `margin-inline-end:clamp(6px,1.6%,8px)`，抵消旧版宿主滚动区的 `margin-right:calc(-1 * var(--dsh-sidebar-inline-padding))`。新版宿主改成 `4px | 1fr | (inline-padding - 2px)` 三列网格，中列左右边缘正好落在列内缩上（本来就对称），再补右边距反而把整列向左推、右侧留白变大。v1.6.1 已删除该规则，直接沿用宿主自身的对称栅格。
- **图标对齐（v1.6.1）**：皮肤自身的排版改动有三处会让宿主原有图标偏离原位，逐一修正：
  1. 行卡片的 `margin:2px 4px` 使每一行内容比固定控件（顶部折叠按钮、新建会话按钮、底部设置/动作）多右移 4px，文件夹与状态图标因此与上方按钮列不在同一竖线上 → 改为 `margin-block:2px;margin-inline:0`，行内容与固定控件共用同一条边距基准；
  2. 折叠态曾把宿主 `padding:18px 10px 6px` 压成 `5px 3px`，36px 轨道按钮整体左移 7px、上移 13px → 折叠态恢复宿主内缩，只内缩玻璃层；
  3. 工作区文件夹小牌是 18×18，比宿主 16px 的图标槽宽 2px，会把标题右推 1px → 用 `margin-inline:-1px` 让槽位仍占 16px 步进，图标中心线与标题起点保持不变（svg 仍居中）。
  另外统一 `[data-row-key]>span:first-child` 为 `16×20` flex 居中，让文件夹 / 状态点 / 头像共用一条垂直中心线。
  4. 行卡片占满列表轨道后，悬停若再做 `scale(1.012)` 会被宿主滚动区（`overflow:hidden auto`）裁掉左右圆角 → 缩放改到卡片层并收敛到 `1.008`（内缩 4px 足够容纳），图标列因此始终落在宿主栅格上，不会随悬停左右抖动。
- **统一留白（v1.6.2）**：左右两块玻璃板原来各用一套 `clamp()` 内缩（左板 `3–7px`、右板 `4–8px`），窗口宽度变化时两套百分比会走出不同结果。现在合并成一个变量 `--ae-plat-gap:clamp(6px,1.6%,10px)`：左列 `margin` 四边、右栏面板 `top/bottom/right` 与 `width` 全部引用它，于是「到窗口边」「到对话列」「左右栏彼此」的间距在数学上恒等，缩放窗口也不会出现一侧宽一侧窄。玻璃面本身改成 `inset:0` 填满这个留白盒，圆角与投影仍只画在 `::before` 上。
- **立体强度（v1.7.0）**：把「厚度」做成独立的光影层，而不是绑死在布局里。`--ae-plat-ring / -hi / -edge / -shadow` 与 `--ae-card-ring / -hi / -shadow` 由 `body[data-ae-depth]` 三档预设改写：**柔和**（几乎无投影，像一块磨砂玻璃卡纸）、**标准**（默认 v1.6.x 观感）、**强烈**（更亮的边缘高光 + 底部内暗边 + 三层厚投影 + 悬停 `translateY(-3.4px) scale(1.012)`）。切换只改光影，布局、图标、位置一律不动；AETHER 设置页「立体强度」一行可切换（默认「强烈」），偏好写入 `localStorage` 的 `depth` 键。深/浅两套各自有一套预设，避免深色投影在浅色上脏掉。
- **自适应留白补偿（v1.6.4）**：宿主的会话列表给右侧滚动条留了 `padding-right: calc(inline-padding - scrollbar-width - 2px)` 的槽位，而实际跑在悬浮滚动条下时这个槽位里什么都没有——于是卡片右边缘与玻璃板的间距会比左边大几个像素（看起来「右边空得多」或「右边贴太紧」）。与其猜滚动条宽度，插件在运行时量一次：`syncRingFix()` 取第一行的 `getBoundingClientRect()` 与侧栏列比较，把「右间距 − 左间距」写进列上的 `--ae-ring-right-fix`（限制在 ±14px），卡片面 `::before` 的右内缩随之为 `calc(var(--ae-card-inset) - var(--ae-ring-right-fix))`。**只移动卡片面，不动行盒子**，所以图标列仍落在宿主栅格上；窗口尺寸变化时（`resize`）与宿主重挂载时重新测量。
- **回归修复（v1.6.3）**：v1.6.2 把 `--ae-plat-gap` 插进了 `--ae-plat-bg` 这个**跨行**的声明中间，CSS 自定义属性的值会一直吃到最近的 `;`，于是渐变与间隙变量被合并成一条非法值：玻璃面退化成透明矩形、`margin:var(--ae-plat-gap)` 因变量未定义而变成 0——「立体玻璃感消失」就是这么来的。现在变量声明排在完整渐变之后，并新增冒烟守卫：`--ae-plat-bg` 的值里不得再出现 `--ae-plat-gap`，且两个主题各必须声明一次该间隙变量。
- **卡片绘制层（v1.6.2）**：卡片面从「行盒子自己的背景」改成「行内 `::before` 绝对定位层」，行盒子的 margin / background / border-radius 全部归零。这样做的两个好处：① 卡片左右内缩 `4px` 由 `inset` 决定，天然左右对称，不再依赖宿主列表轨道左右是否严格相等；② 行盒子不参与任何绘制与位移，宿主原有的图标列、hover 背景、拖拽落点、焦点环全部保持原生几何。
- **选中后悬停变「隐形字」（v1.6.2 修复）**：选中规则与悬停规则曾同为 `(0,4,1)` 特异性、悬停规则在后，于是「选中 + 悬停」时背景被换回半透明 hover 底、文字却仍是反相的深墨色 → 字与底重叠不可读。现在悬停选择器显式排除选中行（`:not([aria-selected="true"])`），选中行悬停只做位移与投影，反相表面与文字颜色始终成对。
- **右栏同款（v1.3.0）**：右栏的面板是绝对定位的（注释里写明 right column is a track, not a box），给列加 padding 不会移动它，所以改为直接内缩面板盒：`right/bottom` 内缩 + `width:calc(100% - 两个内缩之和)` 保证左右等距，再套同一套 `--ae-plat-*` 材质；`[data-sidebar-right-panel="fullscreen"]` 形态跳过（全屏面板本来就该贴边）。面板内部 dock 面改透明，玻璃板成为唯一表面。
- **不透明度来源**：宿主侧栏根节点自带不透明底（`specific-sidebar-fill`），会盖住玻璃板，所以 `.ae-sidebar>*` 统一改透明，让玻璃层成为唯一表面。
- **层级**：面板自身不加 `z-index`；卡片层用 `position:absolute + z-index:-1` 贴在行内、在文字之下、在玻璃板之上（列上的 `isolation:isolate` 把负层锁在侧栏内部，不会掉到页面背景后面）。星河层在面板之上（`screen` 混合），玻璃的模糊只作用于面板背后——背后是静态的 frame/桌面，所以滚动时不会持续重算，成本只有一层合成。
- **可读性**：卡片底始终是「侧栏底色 + 少量 layer-2」，文字仍走 `label-primary / label-secondary` 令牌；浅色下卡片是白 64% 不透明，深色下是 40% + 深底，两种主题下正文对比度的来源不变（只改变了底色明度，未改变文字颜色）。
- **动效预算**：位移 2.5px（悬停）/ 3px（选中悬停）、无横向缩放，全程 `transform`，不触发布局；`prefers-reduced-motion` 下过渡置 none、位移归零。
- **失效兜底**：若宿主未来改动 AppFrame 的 DOM 结构导致定位不到侧栏，标记步骤静默跳过，皮肤其余部分照常工作，不会报错也不会误伤别的元素。

### 3.3 工作区与对话的层级区分

左侧列表里「工作区（容器）」与「对话（叶子）」原本只差一个小图标，扫视时难以分辨。做法是让**容器先行**——只改颜色、字重与发光，不动行高和缩进，标题左边界与宿主完全一致：

| 对象 | 表面 | 图标 | 标题 |
| --- | --- | --- | --- |
| 工作区行 `[data-row-key^="workspace:"]` | 强调色 13%（深）/10%（浅）掺入卡片底，描边也带强调色 | 文件夹图标放进 18×18 的强调色玻璃小牌（6 圆角 + 内描边），图标 13px，带 `drop-shadow` 外发光 | 600 字重 |
| 对话行 `[data-row-key^="session:"]` | 中性半透明玻璃卡片 | 无牌、无发光 | 400 字重 |
| 溢出/更多行 `[data-row-key^="overflow:"]` | 透明、无投影 | — | — |

强调色跟随主题轨道（冰蓝/薄荷/琥珀），切换时整组自动变色；悬停时工作区行的底色再加深一档，与对话行的中性悬停区分开。

---

### 3.3 对话区圆角与留白（v1.8.0）

宿主只给对话列（中间 track）圆了左上角（`border-radius: var(--dsh-windows-content-radius) 0 0 0`），其余三角是直角、且与两侧栏同色，读起来像一块铺满的矩形。v1.8.0 用一个运行时标记补上这一层：

- `syncHost()` 找到侧栏列后取它的 `nextElementSibling`（即对话列），加 `.ae-main`，并发布 `body[data-ae-main="on"]`；右栏重挂载时由 `MutationObserver` 与 `resize` 重打。
- 样式只动这一列：`border-radius: clamp(13px,1.5vw,19px)`（四角同值）+ 四边 `margin: clamp(4px,.55vw,7px) clamp(5px,.7vw,9px)`，外加 1px 发丝环与一抹向下的柔和投影，让圆角在深/浅两套底色上都能被看见。
- 不改网格轨道：列宽由宿主 `grid-template-columns` 决定，margin 只是把**绘制面**从贴边收进来，因此右栏位置、拖拽手柄、滚动条都保持原位；这也是「对话框右边恢复正常」的做法——右侧不再被玻璃内缩挤压，而是回到宿主自己的间距，再叠加统一的 5–9px 呼吸位。
- 圆角与投影是纯绘制层，`overflow:hidden` 由宿主本来就有，所以消息内容不会被裁出新边。


### 3.4 列表语言：工作区 vs 对话（v1.9.0）

左栏列表现在有两套视觉等级，且**与「立体平台」开关解耦**（`body[data-ae-rows="on"]`，皮肤启用即生效）：

| 元素 | 深色 | 浅色 |
| --- | --- | --- |
| 对话行（叶子） | 半透明深灰卡片、1px 内环、浅投影 | 近白卡片、蓝黑内环 |
| 对话行 · 选中 | **近白** `#EDF1F7` 底 + 深墨字（灰 → 白反相） | **中性灰** `#3E4753` 底 + 近白字（白 → 灰反相） |
| 工作区行（容器） | accent 18% 染色卡 + 42% accent 环 + 更厚投影 + 14px 圆角 | accent 14% 染色卡 + 36% accent 环 |
| 工作区 · 悬停 | `translateY(-3px)` + 更深投影 | 同上 |
| 工作区 · 选中 | 与叶子同一张 ink 卡（保证选中态两种行都清晰） | 同上 |

要点：

- **卡片绘制层**：仍在行内 `::before`（`inset: 1px 4px`），行盒子保持透明，图标列继续落在宿主 16px 栅格上；`--ae-ring-right-fix` 的实测补偿仍在生效，左右内缩对称。
- **选中后悬停不再变瞎**：悬停选择器显式排除 `[aria-selected="true"]`，选中行只位移、不改底色；选中行文字由 `color: var(--ae-card-sel-ink-fg)` + 子孙 `:where(*){color:inherit !important}` 接管，所以图标、标题、副标题一起反相。
- **工作区色阶**：容器用 accent 染色与更厚的投影先读出来，叶子保持中性；工作区行圆角 14px 比叶子 12px 略圆，视觉上更像「一块可以展开的面板」。
- 深/浅两套各自定义 `--ae-ws-*` 与 `--ae-card-sel-*`，切换主题不需要额外覆盖。


## 4. 版式与组件

| 组件 | 规则 |
| --- | --- |
| 按钮 primary | 金属渐变 + `.5px` 内高光 + 1px 投影；高 32，圆角 10，13px 字 |
| 按钮 ghost | 透明底 + `border-l3` 发丝边；hover 用 `interactive-bg-hover`（冷灰 6% 洗色） |
| 输入框 | `specific-input-major` 底、`border-l2` 边、focus 用业务色 2px ring（offset 1） |
| 开关 | 复制宿主原语：36×20、999 圆角、`border-l3` 轨道，选中 `brand-primary`，thumb 用 `switch-thumb` + 16px 位移 |
| 分段选择 | 2px 内衬 + `interactive-bg-hover` 底；选中项提为 `button-floating-fill` + 极轻投影；色点用强调色渐变 |
| 卡片 | `bg-layer-1` + 发丝边 + 12 圆角；标题 12/600，说明 11/次级色 |
| 徽标 | 22px 高的胶囊 + 发丝边；在线点 5px，4800ms 极慢脉冲（唯一的环境动效） |
| 设置页版式 | 严格沿用宿主：`.row` 上下 16、行间 `.5px` 分隔、末行无分隔；标题 14/20，说明 12/18 次级色 |
| 分组标题 | 10px 全大写 + 0.14em 字距，像仪器面板的标签 |
| 导航 | 不改结构，只吃令牌：侧栏底 `#080B10`、当前项 `#141B25`、accent 态 `#1B2534` |
| 工作区面板 | 独立玻璃层（`::before`，随列宽等比内缩、`clamp()` 圆角、背景模糊、1px 高光环 + 柔和投影），内容经 padding 同步内缩，比外框略小、四边留白 |
| 会话 / 工作区卡片 | 12 圆角半透明卡片，悬停抬 1.5px、选中抬 1px 并叠强调色淡染；220ms 缓动 |

字阶沿用宿主，不接管排版：本皮肤只提供 10/11/12/13/14 这五档在自有组件内使用，正文与标题继承 DSH。

---

## 5. 动效原则

| 时长 | 用途 |
| --- | --- |
| 90ms | 按下（translateY .5px） |
| 140ms | hover 底色/描边 |
| 160ms | 开关滑动、分段选中 |
| 220ms | 工作区卡片悬停/选中的抬起、底色与投影变化 |
| 4800ms | 在线点脉冲（控制台内的环境动效） |
| 17000ms | 星河闪烁层的透明度呼吸（仅深色启用） |
| 190000ms | 前景巨星层缓慢漂移（视差用，仅深色启用） |

- 缓动统一 `cubic-bezier(.16,1,.3,1)`（ease-out）：进入快、收尾软，可预测。
- 只动 `background / border-color / color / transform / opacity`；不动宽高与布局。
- 不在滚动、窗口缩放上挂钩任何动画；无视差、无粒子、无 3D 翻转。
- `prefers-reduced-motion: reduce` 下：全部 transition 置 none、脉冲与星河呼吸动画停止（已实现）。
- 焦点永远可见：`:focus-visible` 2px ring + 2px offset，键盘用户优先。

---

## 6. 一致性 & 可扩展性

**一致性**
- 单一事实来源：`BASE`（119 个 alias 令牌）+ `ACCENTS`（3 轨道）；组件不写死颜色，一律 `var(--dsw-alias-*)`。
- 状态语义固定：hover 6%、active 10%、accent-hover 14%；三档透明度全局统一。
- 浅/深成对定义：任何一个令牌都必须给出 `[light, dark]`，禁止"只在深色下好看"。

**可扩展性**
- 新增强调色：往 `ACCENTS` 加一项 + `ACCENT_ORDER` 加 key，选择器与所有着色自动生效。
- 新增令牌：往 `BASE` 加一行 `[light, dark]`，`buildTokens` 自动并入覆盖层。
- 新增组件：在自己的 `.ae-` 前缀下写 class，只消费令牌；不与宿主 class 冲突。
- 新增氛围开关：`DEFAULTS` 加一个布尔 + 控制台加一行 + 图层里判断即可；星河浓度已经是 `LEVELS` 表，加档位只改一行。
- 新增「宿主侧栏风格」：玻璃平台已经是「运行时打 class + `body` 属性门控 + 纯 CSS」三段式，换一套皮肤只需替换 `.ae-sidebar` 的取值，开关与还原逻辑不动。
- 宿主升级：令牌名不变则皮肤不动；若宿主新增 alias，皮肤未覆盖的项自动回落到宿主默认，不会破坏可读性。
- 关闭即还原：`overrideTokens` 返回的 disposer 精确移除本层，不影响其它主题层。

---

## 7. 实现映射

```
client.js
├─ BASE      124 × [light, dark] 令牌 = 宿主 119 个 alias + 5 个补充
│           （bg-layer-4 / label-error / hovercard-bg / focus-ring-color / focus-ring-width）
├─ ACCENTS   ice / mint / amber，含金属渐变与 focus-ring-color
├─ buildTokens(accent)          → { '--dsw-x': { light, dark } }
├─ store      localStorage "dsh-aether-skin.v1" = { enabled, accent, veil, galaxy, galaxyLevel, glass }
├─ CSS        .ae-* 前缀：氛围层、星河（.ae-sky / .ae-sky-field / .ae-sky-twinkle / @keyframes ae-twinkle）、
│           玻璃平台（body[data-ae-glass="on"] .ae-sidebar 与 [data-row-key] 卡片）、滚动条、选区、控制台组件、reduced-motion
├─ 组件        Mark / Switch / AccentPicker / Board / Palette / Section / Veil
└─ apply(ctx)
   ├─ ctx.theme.overrideTokens('@local/dsh-aether-skin', buildTokens(accent))
   ├─ ctx.effect → <style data-plugin="…" data-plugin-css="aether-skin">
   ├─ ctx.locale.register('aetherSkin', 'zh'|'en', DICT)
   ├─ 侧栏标记 findSidebar/tagSidebar → 给宿主侧栏加 .ae-sidebar（MutationObserver 补打，cleanup 移除）
   ├─ syncHost                            → body[data-ae-glass] 属性门控玻璃平台
   ├─ ctx.slots.inject('shell.overlay')      → Veil（click-through）
   └─ ctx.slots.inject('settings.section')   → Section（id: aether-skin, order: 55）
```

宿主把全部令牌写成 `body` 的内联变量并切换 `body[data-ds-dark-theme]`，所以：
- 覆盖令牌只能走 `overrideTokens`（样式表改不动内联变量）；
- 自有 CSS 用 `body[data-ds-dark-theme]` 判断深浅，不猜主题。

---

## 8. 安装 / 卸载

安装（DSH 内）：

```
plugin_manager(action: "install_bundle", target: "/Users/miaoguoqing/Desktop/DSHs/dsh-creative/dsh-aether-skin")
```

安装后无需重启：`immediately: true`，客户端模块即时加载。
设置 → **AETHER** 页可开关皮肤、切换强调色、开关氛围层、开关**星河背景**并调浓度（隐约 / 标准 / 浓郁）、开关**立体平台**、看组件预览与令牌色板、恢复默认。关闭立体平台会立即移除侧栏玻璃与卡片阴影，恢复宿主原生外观（不影响任何偏好以外的东西）。
卸载：`plugin_manager(action: "remove_bundle", target: "@local/dsh-aether-skin")`；或在设置页关闭皮肤（立即恢复原生外观，插件仍保留以便再开）。

---

## 9. 文件

```
dsh-aether-skin/
├─ package.json        exports / files / dsh.bundle.patch / dsh.client
├─ cordis.patch.yml    insert: id dsh-aether-skin
├─ index.js            Host half（空实现，视觉全部在客户端）
├─ client.js           皮肤本体（令牌 + 样式 + 控制台 + 氛围层 + 星河背景 + 玻璃平台标记）
├─ locale/en.json      meta.title / meta.description
├─ locale/zh.json      同上（中文）
└─ icon.svg            原创图标：深空圆角方块 + 银灰渐变弧 + 冰蓝核心点
```

---

## 10. 验证边界（如实说明）

- ✅ `node --check client.js` 通过；与宿主 `design-platform.css` 逐项比对：119/119 个 alias 令牌全部覆盖，无拼写偏差；另补 5 个宿主实际使用但未声明的令牌。
- ✅ 离线冒烟测试（stub 了 `window.__ModuleLoader__` / `document` / React / ctx）：124 个令牌均为合法 `{light,dark}` 字符串对；`overrideTokens` 只调用一次并带上 source；CSS 花括号配平、无宿主 hash class；两个槽注册参数正确（`settings.section` id=`aether-skin`、order=55；`shell.overlay` id=`aether-atmosphere`、order=900）。
- ✅ 星河测试（v1.5.0 深空版）：3 个星点字段独立解码校验——远景 420 颗、银河带 260 颗、前景 18 颗（viewBox 2400×1600、无 NaN、不含 `<g>`/`<polygon>` 航天器图元、远景与银河带最大半径 ≤2、前景 ≤3.4 即**不存在光晕圆盘**、六档色温齐全）；CSS 断言含 `--ae-near`、`@keyframes ae-float`、浅色 `multiply` 覆盖、`reduced-motion` 同时停掉闪烁与漂移，且**不含** `filter:blur(.6px)`；`.ae-sky` 仅在 `galaxy` 开启时渲染，浓度档位映射 0.80/1.05/1.42、未知档位回落 0.80，`pointer-events:none` 全程保持。
- ✅ 层级区分（v1.5.0）：CSS 断言存在 `[data-row-key^="workspace:"]` 的强调色表面、`--ae-ws-plaque` 玻璃小牌与 13px 文件夹图标发光规则，以及 `[data-row-key^="overflow:"]` 的中性兜底；工作区与对话的标题左边界、行高、缩进均未改动。
- ✅ 列表语言（v1.9.0）：断言行卡片规则挂在 `data-ae-rows` 而非 `data-ae-glass`、工作区卡 `border-radius:14px` + accent 染色、浅色选中为中灰 `#3E4753`、工作区选中共享 ink 卡；`enabled:false` 时不发布 `data-ae-rows`。
- ✅ 对话区圆角（v1.8.0）：断言 `.ae-main` 规则存在、`border-radius:clamp(13px,1.5vw,19px)`、默认 `body[data-ae-glass]` 不设置（平面为默认）、`body[data-ae-main="on"]` 默认发布、`enabled:false` 时两条属性都清除。
- ✅ 立体强度（v1.7.0）：断言三档预设选择器存在、`--ae-plat-depth:1`（标准档标记）、强烈档悬停位移 `translateY(-3.4px) scale(1.012)`、中英文案键 `depth*` 齐全；stub 侧断言首次挂载即发布 `body[data-ae-depth]`，缺省值落到 `strong`。
- ✅ 自适应留白（v1.6.4）：断言卡片面右内缩引用 `--ae-ring-right-fix`（`calc(var(--ae-card-inset,4px) - var(--ae-ring-right-fix,0px))`）、存在 `syncRingFix()` 测量函数、两个主题各自声明 `--ae-card-inset:4px`。
- ✅ 声明完整性（v1.6.3）：断言 `--ae-plat-bg` 声明里不再混入其他自定义属性（正则 `/--ae-plat-bg:[^;]*--ae-plat-gap/` 必须不匹配），且 `--ae-plat-gap` 在深/浅两套变量里各恰好出现一次。
- ✅ 统一留白（v1.6.2）：断言存在 `--ae-plat-gap:clamp(6px,1.6%,10px)`、左列 `margin:var(--ae-plat-gap) !important`、玻璃面 `inset:0`、右栏 `width:max(0px, calc(100% - var(--ae-plat-gap) * 2))`。
- ✅ 卡片绘制层（v1.6.2）：CSS 断言卡片面为行内 `::before`（`inset:1px 4px;border-radius:12px`），行盒子 `margin-inline:0 !important` 且无背景/投影；断言悬停选择器带 `:not([aria-selected="true"])`，防止「选中 + 悬停」再次把文字压成不可读。
- ✅ 图标对齐（v1.6.1）：CSS 断言行卡片为 `margin-block:2px;margin-inline:0`，且不再出现 `margin:2px 4px` 与旧规则 `margin-inline-end:clamp(6px,1.6%,8px)`；折叠态为 `padding:18px 10px 6px`；文件夹小牌为 `width:18px;height:18px;margin-inline:-1px`；行首槽位统一为 flex 居中；悬停为 `translateY(-2.5px)` 且不再出现 `scale(1.012)`（避免被宿主滚动区裁切）。
- ✅ 布局回归（v1.2.1）：CSS 断言 `.ae-sidebar` 只用 `padding:clamp(...)` 内缩、不再出现 `margin:10px 9px 12px`，玻璃面来自 `::before`（`z-index:-1`、`pointer-events:none`），折叠态 `[data-sidebar-collapsed]>.ae-sidebar` 有独立内缩；`findSidebar()` 增加三道防线（必须找到含 `[data-shell-bottom]` 的真 AppFrame、优先取包住 `[role=tree]/[data-row-key]` 的列、列宽不得超过 frame 宽度的 60%），避免把整壳容器误标成侧栏。
- ✅ 双板与留白（v1.3.0）：右栏面板按 `[data-sidebar-right-panel]` 做等距内缩（`right` 与 `width:calc(100% - 2×inset)` 联动，`fullscreen` 除外），dock 面透明；左栏 `[role="tree"]` 补 `margin-inline-end:clamp(6px,1.6%,8px)` 抵消宿主滚动区的负右边距，左右留白相等；卡片悬停提升到 `-2.5px / 1.012`，玻璃板改为三层投影 + 内外双高光。
- ✅ 选中反相（v1.3.1）：CSS 断言选中行背景为 `var(--ae-card-sel-ink)`、文字为 `var(--ae-card-sel-ink-fg)`，深色 `#EDF1F7` / 浅色 `#12171F` 两套黑墨值存在，且选中行子孙统一 `color:inherit`。
- ✅ 玻璃平台测试（stub `document`/`MutationObserver`/`body.dataset`）：默认状态下 `body[data-ae-glass="on"]` 被设置、宿主侧栏被标记 `.ae-sidebar`；控制台渲染 6 行（含 Glass platform），点开关后属性被移除、class 保留（由属性门控），`glass:false` 与 `enabled:false` 均不标记；缺省偏好回落 `glass:true`；CSS 含 `blur(26px) saturate(140%)`、`translateY(-1.5px) scale(1.006)`、`220ms` 过渡与 reduced-motion 归零，且不含宿主 hash class。
- ✅ 偏好矩阵测试：ice / mint / amber 三轨着色正确；`enabled:false` 时不产生任何令牌覆盖；非法 accent 回落到 ice；深色主按钮为金属渐变、浅色为石墨渐变、`brand-primary` 保持纯色。
- ✅ `plugin_manager.install_bundle` 安装成功（`application: applied`，无本插件相关 warning），`cordis_inspect_query` 确认两个槽的占用者均为 `active`。
- ⚠️ 本环境**无浏览器控制权限**，未做截图级视觉验证：图标观感、控件像素对位、氛围层强度、玻璃面板的模糊半径与卡片抬起幅度均需在 GUI 内目测微调。
- ⚠️ 玻璃平台依赖宿主 AppFrame 的 DOM 形状（侧栏是 frame 的首个 div 子元素、浮层是 `[data-shell-overlay]`）与行元素的 `[data-row-key]` / `aria-selected`；若宿主大改结构，标记会静默跳过（不会报错），此时只需更新 `findSidebar()` 的定位方式。
- 若需微调：星河浓度在 `LEVELS`（三档乘数）、星云云团与 112° 光带在 `CSS` 的 `--ae-band`、星点数量/半径/亮度与闪光长度在 `starWall()` 与 `spark()`、前景漂移幅度在 `@keyframes ae-float`；工作区行强调色比例在 `--ae-ws-bg` / `--ae-ws-plaque`；氛围层透明度在 `CSS` 里 `--ae-glow-a/--ae-glow-b/--ae-vignette` 三处；金属渐变的三个 stop 在 `LIGHT_METAL` / `ACCENTS.*.metal`；玻璃面板与卡片的模糊半径、内缩、投影强度在 `CSS` 的 `body[data-ae-glass="on"]` 两段变量块里。
