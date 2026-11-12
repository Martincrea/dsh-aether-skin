/**
 * AETHER · 静默科技 — DSH skin, browser half.
 *
 * Three layers, all hosted by the framework instead of fighting it:
 *   1. colour      — ctx.theme.overrideTokens() over the whole --dsw-alias-* set
 *                    (deep-space dark / silver-sand light, chosen by accent),
 *                    including the two primary-button tokens that accept a
 *                    metal gradient because the host paints them with the
 *                    `background` shorthand.
 *   2. atmosphere  — one click-through entry in `shell.overlay`: a barely-there
 *                    cool glow plus a corner vignette. Never touches layout.
 *   3. console     — one page in `settings.section`: skin switch, accent rail,
 *                    atmosphere switch, live component preview, token palette.
 *
 * No layout, spacing or typography rules of the host are overridden: the skin
 * only re-tints tokens and adds its own prefixed classes for its own surfaces.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-aether-skin',
  factory(require) {
    var React = require('react');
    var h = React.createElement;

    var SOURCE = '@local/dsh-aether-skin';
    var STORAGE_KEY = 'dsh-aether-skin.v1';
    var VERSION = '1.9.3';

    // ══════════════════════════════════════════════════════════════════════
    // 1. Palette — every value is a [light, dark] pair.
    //    Light = 银砂 (silver sand), dark = 深空 (deep space).
    // ══════════════════════════════════════════════════════════════════════
    var BASE = {
      // surfaces
      '--dsw-alias-bg-base': ['#F2F4F8', '#05070A'],
      '--dsw-alias-bg-layer-1': ['#FFFFFF', '#0A0E14'],
      '--dsw-alias-bg-layer-2': ['#FAFBFD', '#11161E'],
      '--dsw-alias-bg-layer-3': ['#F1F4F8', '#171E28'],
      '--dsw-alias-bg-layer-4': ['#F4F6FA', '#1A222C'],
      '--dsw-alias-bg-overlay': ['#E8ECF2', '#232C38'],
      '--dsw-alias-bg-module-platform': ['#F2F4F8', '#171E28'],
      '--dsw-alias-bg-multi-select': ['#F0F3F8', '#141B24'],
      '--dsw-alias-bg-skeleton': ['#0000000A', '#FFFFFF12'],
      '--dsw-alias-bg-document-preview': ['#EEF1F6', '#0A0E14'],
      '--dsw-alias-label-document-preview': ['#45505F', '#7C8798'],
      '--dsw-alias-bg-mask-1': ['#0000003D', '#00000099'],
      '--dsw-alias-bg-mask-2': ['#0000001F', '#00000059'],
      '--dsw-alias-bg-mask-3': ['#0000007A', '#000000B3'],
      '--dsw-alias-bg-mask-photo': ['#000000E0', '#000000E6'],
      '--dsw-alias-bg-mask-drop': ['#FFFFFFB3', '#0A0E14B3'],

      // hairlines
      '--dsw-alias-border-l1': ['#E9EDF3', '#141B24'],
      '--dsw-alias-border-l2': ['#DDE2EA', '#1D2530'],
      '--dsw-alias-border-l2-darkmode-thin': ['#E9EDF3', '#1A222C'],
      '--dsw-alias-border-l3': ['#C5CED9', '#2A3442'],
      '--dsw-alias-border-l4': ['#A9B4C2', '#3B4859'],
      '--dsw-alias-border-inverted': ['#00000000', '#FFFFFF0F'],
      '--dsw-alias-border-inverted2': ['#00000000', '#FFFFFF14'],

      // type
      '--dsw-alias-label-primary': ['#0B1016', '#F2F5F9'],
      '--dsw-alias-label-primary-dimmed': ['#151B23', '#E6ECF3'],
      '--dsw-alias-label-primary-inverted': ['#FFFFFF', '#05070A'],
      '--dsw-alias-label-primary-foreground': ['#FFFFFF', '#05070A'],
      '--dsw-alias-label-primary-bluish': ['#10294D', '#DCE9FA'],
      '--dsw-alias-label-secondary': ['#45505F', '#AEB9C8'],
      '--dsw-alias-label-tertiary': ['#6B7787', '#7C8798'],
      '--dsw-alias-label-caption': ['#8B95A3', '#545F70'],
      '--dsw-alias-label-dimmed': ['#E8ECF2', '#2A3442'],
      '--dsw-alias-label-error': ['#C23B3B', '#F18585'],
      '--dsw-alias-label-shimmer': [
        'color-mix(in srgb, #0B1016 28%, transparent)',
        'color-mix(in srgb, #F2F5F9 45%, transparent)',
      ],

      // brand + buttons (flat; the two gradient accents live in ACCENTS)
      '--dsw-alias-brand-primary': ['#151B23', '#C5CED9'],
      '--dsw-alias-brand-primary-invert': ['#151B23', '#F2F5F9'],
      '--dsw-alias-brand-text': ['#151B23', '#E6ECF3'],
      '--dsw-alias-button-primary-dimmed': ['#C5CED9', '#2A3442'],
      '--dsw-alias-button-contrast-fill': ['#151B23', '#F2F5F9'],
      '--dsw-alias-button-elevated-fill': ['#FFFFFF', '#1D2530'],
      '--dsw-alias-button-floating-fill': ['#FFFFFF', '#171E28'],
      '--dsw-alias-button-floating-hover': ['#F1F4F8', '#202A36'],
      '--dsw-alias-button-ghost-active-fill': ['#E8ECF2', '#202A36'],
      '--dsw-alias-button-ghost-active-hover': ['#DFE5EC', '#27323F'],
      '--dsw-alias-button-ghost-active-border': ['#A9B4C2', '#3B4859'],
      '--dsw-alias-button-tool-bar-fill': ['#54555780', '#54555780'],
      '--dsw-alias-button-tool-bar-fill-invisible': ['#1F1F1F5C', '#1F1F1F5C'],
      '--dsw-alias-button-tool-bar-hover': ['#54555799', '#54555799'],

      // interaction tints — a cool silver wash, never a warm grey
      '--dsw-alias-interactive-bg-hover': ['#1E2A360F', '#BCD0E614'],
      '--dsw-alias-interactive-bg-active': ['#1E2A361A', '#BCD0E624'],
      '--dsw-alias-interactive-bg-hover-accent': ['#1E2A3624', '#BCD0E63D'],
      '--dsw-alias-interactive-bg-hover-danger': ['#C23B3D0F', '#F1858526'],
      '--dsw-alias-interactive-bg-hover-solid': ['#E8ECF2', '#1A222C'],

      // states
      '--dsw-alias-state-done-primary': ['#6D4AE0', '#B8A6FF'],
      '--dsw-alias-state-error-primary': ['#C23B3B', '#F18585'],
      '--dsw-alias-state-error-secondary': ['#D95656', '#F5A0A0'],
      '--dsw-alias-state-success-primary': ['#1F8F63', '#72D6A9'],
      '--dsw-alias-state-success-secondary': ['#2AA878', '#94E3C0'],
      '--dsw-alias-state-success-tertiary': ['#E6F6EE', '#16281F'],
      '--dsw-alias-state-warn-label': ['#A96A0C', '#E8C176'],
      '--dsw-alias-state-warn-primary': ['#B57311', '#E8C176'],
      '--dsw-alias-state-warn-secondary': ['#C97F17', '#F0D19A'],
      '--dsw-alias-state-warn-tertiary': ['#FDF4E4', '#2A2419'],
      '--dsw-alias-state-idle-primary': ['#C5CED9', '#3B4859'],

      // floating chrome
      '--dsw-alias-menu-icon': ['#3B4859', '#CBD5E1'],
      '--dsw-alias-menu-group-header-fill': ['#F8F9FAF0', '#11161EF0'],
      '--dsw-menu-surface-fill': ['#FFFFFFD9', '#11161ED9'],
      '--dsw-specific-menu': ['#FFFFFFD9', '#11161ED9'],
      '--dsw-specific-input-major': ['#FFFFFF', '#0E141B'],
      '--dsw-specific-login-input': ['#F7F9FC', '#0A0E14'],
      '--dsw-specific-selector': ['#F4F6FA', '#1A222C'],
      '--dsw-specific-sidebar-fill': ['#EEF1F6', '#080B10'],
      '--dsw-specific-sidebar-nav-item-active': ['#E5E9F0', '#141B25'],
      '--dsw-specific-sidebar-nav-item-active-accent': ['#DCE6F5', '#1B2534'],
      '--dsw-specific-tip': ['#F4F6FA', '#1A222C'],
      '--dsw-specific-bubble': ['#F4F6FA', '#11161E'],
      '--dsw-specific-bubble-highlight': ['#E3EAF5', '#1A2430'],
      '--dsw-alias-toast-bg': ['#151B23', '#1D2530'],
      '--dsw-alias-toast-label': ['#FFFFFF', '#F2F5F9'],
      '--dsw-alias-tooltip-bg': ['#151B23', '#1D2530'],
      '--dsw-hovercard-bg': ['#FFFFFF', '#11161E'],
      '--dsw-alias-tooltip-key-bg': [
        'color-mix(in srgb, #151B23, white 18%)',
        'color-mix(in srgb, #2A3442, white 18%)',
      ],
      '--dsw-alias-switch-thumb': ['#FFFFFF', '#0A0E14'],
      '--dsw-alias-turn-trigger-bg': ['#F5F7FA', '#FFFFFF14'],
      '--dsw-alias-turn-trigger-bg-hover': ['#EDF1F6', '#FFFFFF24'],

      // code + markdown
      '--dsw-alias-markdown-code-block': ['#F5F7FA', '#080B10'],
      '--dsw-alias-markdown-code-block-banner': ['#EEF2F7', '#0E141B'],
      '--dsw-alias-markdown-code-segment-selected': ['#FFFFFF', '#1A222C'],
      '--dsw-alias-markdown-code-segment-unselected': ['#EFF2F7', '#0A0E14'],
      '--dsw-alias-markdown-inline-code': ['#F0F3F8', '#10161D'],
      '--dsw-alias-markdown-placeholder': ['#F2F4F8', '#141B24'],
      '--dsw-alias-markdown-tag': ['#EBEFF5', '#17202B'],
      '--dsw-alias-markdown-citation': ['#EBEFF5', '#1D2530'],
      '--dsw-alias-code-diff-added': ['#1F8F6314', '#72D6A91F'],
      '--dsw-alias-code-diff-deleted': ['#C23B3B14', '#F185851F'],
      '--dsw-alias-file-diff-added-bg': ['#E9F6EF', '#14231B'],
      '--dsw-alias-file-diff-added-gutter': ['#F1FAF5', '#101B15'],
      '--dsw-alias-file-diff-added-marker': ['#1F8F63', '#72D6A9'],
      '--dsw-alias-file-diff-deleted-bg': ['#FBECEC', '#26181A'],
      '--dsw-alias-file-diff-deleted-gutter': ['#FDF3F3', '#1C1214'],
      '--dsw-alias-file-diff-deleted-marker': ['#C23B3B', '#F18585'],

      // scrollbars
      '--dsw-alias-scrollbar-bg-l1': ['#DDE2EA', '#1D2530'],
      '--dsw-alias-scrollbar-bg-l2': ['#DDE2EA', '#1D2530'],
      '--dsw-alias-scrollbar-hover-l1': ['#C5CED9', '#3B4859'],
      '--dsw-alias-scrollbar-hover-l2': ['#C5CED9', '#3B4859'],

      // empty-state artwork
      '--dsw-alias-illustration-background': ['#F2F4F8', '#11161E'],
      '--dsw-alias-illustration-backing': ['#C5CED9', '#2A3442'],
      '--dsw-alias-illustration-detail': ['#C5CED9', '#3B4859'],
      '--dsw-alias-illustration-inset': ['#EBEFF5', '#171E28'],
      '--dsw-alias-illustration-shadow': ['#EBEFF5', '#171E28'],
      '--dsw-alias-illustration-surface': ['#E4E9F0', '#1D2530'],

      // focus (the host reads these two custom properties directly)
      '--dsw-focus-ring-width': ['2px', '2px'],
    };

    // Primary CTA on the light theme stays graphite; on the dark theme it is
    // the one loud surface in the product: brushed silver metal.
    var LIGHT_METAL = 'linear-gradient(180deg, #2C3846 0%, #161D27 55%, #10161E 100%)';
    var LIGHT_METAL_HOVER = 'linear-gradient(180deg, #384656 0%, #1D2733 55%, #1A232E 100%)';

    var ACCENTS = {
      ice: {
        label: 'Ice',
        light: '#1E66C9',
        dark: '#8FC7FF',
        lightSoft: '#1A57AD',
        darkSoft: '#B7DCFF',
        tertiaryLight: '#E4EDFB',
        tertiaryDark: '#16202E',
        metal: 'linear-gradient(180deg, #FFFFFF 0%, #EEF3FA 42%, #C3D0E2 100%)',
        metalHover: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFE 48%, #D6E1EF 100%)',
        swatch: 'linear-gradient(135deg, #B7DCFF, #4C80BB)',
      },
      mint: {
        label: 'Mint',
        light: '#0E7A55',
        dark: '#7FE3BE',
        lightSoft: '#0B6647',
        darkSoft: '#96EBCB',
        tertiaryLight: '#E3F4ED',
        tertiaryDark: '#132A22',
        metal: 'linear-gradient(180deg, #FFFFFF 0%, #EDF6F1 42%, #BED5CA 100%)',
        metalHover: 'linear-gradient(180deg, #FFFFFF 0%, #F5FBF8 48%, #D2E5DA 100%)',
        swatch: 'linear-gradient(135deg, #96EBCB, #2E8E6C)',
      },
      amber: {
        label: 'Amber',
        light: '#A96A0C',
        dark: '#E8C176',
        lightSoft: '#8D5A0B',
        darkSoft: '#F0D19A',
        tertiaryLight: '#FBF0DC',
        tertiaryDark: '#2A2419',
        metal: 'linear-gradient(180deg, #FFFFFF 0%, #F7F0E4 42%, #D3C3A9 100%)',
        metalHover: 'linear-gradient(180deg, #FFFFFF 0%, #FBF6EC 48%, #E2D3B8 100%)',
        swatch: 'linear-gradient(135deg, #F0D19A, #B07A16)',
      },
    };

    var ACCENT_ORDER = ['ice', 'mint', 'amber'];

    /** Accent-dependent alias tokens (the only place the accent rail shows up). */
    function accentTokens(accent) {
      var a = ACCENTS[accent] || ACCENTS.ice;
      return {
        light: {
          '--dsw-alias-link': a.light,
          '--dsw-alias-state-business-primary': a.light,
          '--dsw-alias-state-business-tertiary': a.tertiaryLight,
          '--dsw-alias-brand-primary-new-colorprimary-new-color': a.light,
          '--dsw-alias-button-info-fill': a.light,
          '--dsw-alias-button-info-hover': a.lightSoft,
          '--dsw-alias-bg-document-selection': 'color-mix(in srgb, ' + a.light + ' 22%, transparent)',
          '--dsw-alias-label-deep-diving': 'color-mix(in srgb, ' + a.light + ' 82%, #0B1016)',
          '--dsw-alias-label-deep-diving-shimmer': 'color-mix(in srgb, ' + a.light + ' 46%, #6B7787)',
          '--dsw-alias-button-primary-fill': LIGHT_METAL,
          '--dsw-alias-button-primary-hover': LIGHT_METAL_HOVER,
          '--dsw-focus-ring-color': a.light,
        },
        dark: {
          '--dsw-alias-link': a.darkSoft,
          '--dsw-alias-state-business-primary': a.dark,
          '--dsw-alias-state-business-tertiary': a.tertiaryDark,
          '--dsw-alias-brand-primary-new-colorprimary-new-color': a.dark,
          '--dsw-alias-button-info-fill': a.dark,
          '--dsw-alias-button-info-hover': a.darkSoft,
          '--dsw-alias-bg-document-selection': 'color-mix(in srgb, ' + a.dark + ' 34%, transparent)',
          '--dsw-alias-label-deep-diving': 'color-mix(in srgb, ' + a.dark + ' 62%, #AEB9C8)',
          '--dsw-alias-label-deep-diving-shimmer': 'color-mix(in srgb, ' + a.dark + ' 32%, #7C8798)',
          '--dsw-alias-button-primary-fill': a.metal,
          '--dsw-alias-button-primary-hover': a.metalHover,
          '--dsw-focus-ring-color': a.dark,
        },
      };
    }

    /** Full { token: { light, dark } } map for one accent. */
    function buildTokens(accent) {
      var accentPart = accentTokens(accent);
      var out = {};
      var name;
      for (name in BASE) {
        if (!Object.prototype.hasOwnProperty.call(BASE, name)) continue;
        out[name] = { light: BASE[name][0], dark: BASE[name][1] };
      }
      for (name in accentPart.light) {
        if (!Object.prototype.hasOwnProperty.call(accentPart.light, name)) continue;
        out[name] = {
          light: accentPart.light[name],
          dark: accentPart.dark[name] || accentPart.light[name],
        };
      }
      return out;
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. Copy
    // ══════════════════════════════════════════════════════════════════════
    var DICT = {
      zh: {
        nav: 'AETHER',
        tagline: '静默科技 · 深空底 × 银灰金属',
        enable: 'AETHER 皮肤',
        enableDesc: '令牌级配色覆盖；关闭后立即恢复 DSH 原生外观。',
        accent: '强调色',
        accentDesc: '只用于链接、焦点与状态，不做底纹。',
        veil: '氛围层',
        veilDesc: '顶部的极淡冷光与四角晕影，几乎不可察觉地增加纵深。',
        galaxy: '星河背景',
        galaxyDesc: '低透明度的银河带与星点，叠加在界面之上，不拦截任何点击。',
        galaxyLevel: '星河浓度',
        galaxyLevelDesc: '只改变星点与银河带的透明度，不改变位置与密度。',
        levelSubtle: '隐约',
        levelMedium: '标准',
        levelRich: '浓郁',
        glass: '立体平台',
        glassDesc: '左右工作区都浮起为玻璃面板：内缩留白、背景模糊、发丝高光；左侧卡片悬停或选中时明显上浮。',
        depth: '立体强度',
        depthDesc: '面板厚度、边缘高光与卡片投影的力度；只改光影，不改布局与位置。',
        depthSoft: '柔和',
        depthNormal: '标准',
        depthStrong: '强烈',
        components: '组件预览',
        componentsDesc: '按钮、输入、状态——同一套令牌，浅深两套自动跟随。',
        palette: '令牌色板',
        principles: '设计原则',
        principle1: '光只服务功能：发光只出现在焦点、悬停与在线状态。',
        principle2: '发丝线代替阴影：1px 冷灰描边定义层次，不用大面积投影。',
        principle3: '留白即结构：版面依靠间距分区，不依赖分隔块。',
        principle4: '动效可预测：90–320ms、ease-out；尊重系统“减少动效”。',
        reset: '恢复默认',
        version: '版本',
        on: '开',
        off: '关',
        previewPrimary: '主操作',
        previewSecondary: '次操作',
        previewPlaceholder: '搜索或输入指令…',
        previewLive: '实时',
        previewCardTitle: '卡片标题',
        previewCardDesc: '卡片用发丝边与轻微渐变区分层级，不使用重投影。',
      },
      en: {
        nav: 'AETHER',
        tagline: 'Quiet tech · deep space × silver metal',
        enable: 'AETHER skin',
        enableDesc: 'Token-level palette override; turn it off to restore the native DSH look instantly.',
        accent: 'Accent',
        accentDesc: 'Used for links, focus and states only — never as a tint wash.',
        veil: 'Atmosphere',
        veilDesc: 'A barely-there cool glow at the top plus a soft corner vignette.',
        galaxy: 'Star river',
        galaxyDesc: 'A faint galaxy band and star field layered above the UI; it never captures a click.',
        galaxyLevel: 'Star river intensity',
        galaxyLevelDesc: 'Only the opacity of stars and band changes — never their position or density.',
        levelSubtle: 'Subtle',
        levelMedium: 'Normal',
        levelRich: 'Rich',
        glass: 'Glass platform',
        glassDesc: 'Lifts both workspaces onto glass panels — inset margins, backdrop blur, hairline highlights; cards rise further on hover and selection.',
        depth: 'Depth',
        depthDesc: 'How thick the plates read: rim light, plate shadow and card elevation. Light and shadow only — layout never moves.',
        depthSoft: 'Soft',
        depthNormal: 'Normal',
        depthStrong: 'Strong',
        components: 'Component preview',
        componentsDesc: 'Buttons, input, status — one token set, both schemes follow automatically.',
        palette: 'Token palette',
        principles: 'Design principles',
        principle1: 'Light serves function: glow only on focus, hover and live status.',
        principle2: 'Hairlines instead of shadows: 1px cool-grey outlines carry the hierarchy.',
        principle3: 'Whitespace is structure: spacing separates, not filled blocks.',
        principle4: 'Predictable motion: 90–320ms, ease-out; honour reduced motion.',
        reset: 'Reset',
        version: 'Version',
        on: 'On',
        off: 'Off',
        previewPrimary: 'Primary',
        previewSecondary: 'Secondary',
        previewPlaceholder: 'Search or type a command…',
        previewLive: 'Live',
        previewCardTitle: 'Card title',
        previewCardDesc: 'Cards separate with hairlines and a faint gradient, never heavy shadows.',
      },
    };

    var localeService = null;

    function localeId() {
      try {
        var snap = localeService && localeService.getSnapshot ? localeService.getSnapshot() : null;
        if (snap && typeof snap.active === 'string') return snap.active;
      } catch (err) {
        /* fall through */
      }
      return typeof navigator !== 'undefined' && navigator && navigator.language ? navigator.language : 'en';
    }

    function tr(key) {
      var dict = /^zh/i.test(localeId()) ? DICT.zh : DICT.en;
      if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
      return Object.prototype.hasOwnProperty.call(DICT.en, key) ? DICT.en[key] : key;
    }

    // ══════════════════════════════════════════════════════════════════════
    // 3. Preference store (localStorage, shared by both surfaces)
    // ══════════════════════════════════════════════════════════════════════
    // Star river intensity → opacity multiplier applied by the stylesheet.
    var LEVELS = { subtle: 0.8, medium: 1.05, rich: 1.42 };
    var DEPTHS = { soft: 1, normal: 1, strong: 1 };
    var DEFAULTS = { enabled: true, accent: 'ice', veil: true, galaxy: true, galaxyLevel: 'subtle', glass: false, depth: 'strong' };

    function normaliseDepth(value) {
      return typeof value === 'string' && Object.prototype.hasOwnProperty.call(DEPTHS, value) ? value : DEFAULTS.depth;
    }
    function normaliseLevel(value) {
      return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LEVELS, value) ? value : DEFAULTS.galaxyLevel;
    }
    var store = null;
    var listeners = [];

    function readStore() {
      var next = {
        enabled: DEFAULTS.enabled,
        accent: DEFAULTS.accent,
        veil: DEFAULTS.veil,
        galaxy: DEFAULTS.galaxy,
        galaxyLevel: DEFAULTS.galaxyLevel,
        glass: DEFAULTS.glass,
        depth: DEFAULTS.depth,
      };
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (typeof parsed.enabled === 'boolean') next.enabled = parsed.enabled;
            if (typeof parsed.veil === 'boolean') next.veil = parsed.veil;
            if (typeof parsed.galaxy === 'boolean') next.galaxy = parsed.galaxy;
            if (typeof parsed.glass === 'boolean') next.glass = parsed.glass;
            next.depth = normaliseDepth(parsed.depth);
            if (typeof parsed.accent === 'string' && ACCENTS[parsed.accent]) next.accent = parsed.accent;
            next.galaxyLevel = normaliseLevel(parsed.galaxyLevel);
          }
        }
      } catch (err) {
        /* private mode or corrupt value — defaults are fine */
      }
      return next;
    }

    function getStore() {
      if (store === null) store = readStore();
      return store;
    }

    function writeStore(patch) {
      var current = getStore();
      var next = {
        enabled: current.enabled,
        accent: current.accent,
        veil: current.veil,
        galaxy: current.galaxy,
        galaxyLevel: current.galaxyLevel,
        glass: current.glass,
        depth: current.depth,
      };
      if (typeof patch.enabled === 'boolean') next.enabled = patch.enabled;
      if (typeof patch.veil === 'boolean') next.veil = patch.veil;
      if (typeof patch.galaxy === 'boolean') next.galaxy = patch.galaxy;
      if (typeof patch.glass === 'boolean') next.glass = patch.glass;
      if (typeof patch.depth === 'string') next.depth = normaliseDepth(patch.depth);
      if (typeof patch.galaxyLevel === 'string') next.galaxyLevel = normaliseLevel(patch.galaxyLevel);
      if (typeof patch.accent === 'string' && ACCENTS[patch.accent]) next.accent = patch.accent;
      store = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        /* persistence is best-effort */
      }
      for (var i = 0; i < listeners.length; i += 1) {
        try {
          listeners[i](next);
        } catch (err) {
          /* a broken subscriber must not break the store */
        }
      }
    }

    function useStore() {
      var pair = React.useState(getStore());
      var value = pair[0];
      var setValue = pair[1];
      React.useEffect(function () {
        var fn = function (next) {
          setValue({
            enabled: next.enabled,
            accent: next.accent,
            veil: next.veil,
            galaxy: next.galaxy,
            galaxyLevel: next.galaxyLevel,
            glass: next.glass,
            depth: next.depth,
          });
        };
        listeners.push(fn);
        return function () {
          var at = listeners.indexOf(fn);
          if (at >= 0) listeners.splice(at, 1);
        };
      }, []);
      return value;
    }


    // ══════════════════════════════════════════════════════════════════════
    // 3b. Star river artwork — two deterministic SVG fields, built once.
    //     Vector dots keep the field crisp on any resolution and DPI; the
    //     browser rasterises them once per size, so the twinkle costs only
    //     a compositor opacity animation.
    // ══════════════════════════════════════════════════════════════════════
    function mulberry32(seed) {
      var a = seed >>> 0;
      return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        var t = a;
        t = Math.imul(t ^ (t >>> 15), 1 | t);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    var STAR_W = 2400;
    var STAR_H = 1600;

    /** Band centre line, in viewBox units: lower-left → upper-right, warped. */
    function bandY(x) {
      var bx = x / STAR_W;
      return (0.99 - 0.95 * bx) * STAR_H + Math.sin(bx * Math.PI * 1.25) * STAR_H * 0.058;
    }

    /**
     * Star plates. Every star is a plain dot (no halo rings), and only the
     * brightest few get a thin four-point glint drawn with two hairlines —
     * that keeps the field crisp and reads as "star" at any size.
     */
    var STAR_PALETTE = ['#FFFFFF', '#CFE3FF', '#B9C8FF', '#E3D2FF', '#FFE2B8', '#FFC9DE'];

    function spark(x, y, len, width, alpha, color) {
      return (
        '<path d="M ' + (x - len).toFixed(1) + ' ' + y.toFixed(1) + ' H ' + (x + len).toFixed(1) +
        ' M ' + x.toFixed(1) + ' ' + (y - len).toFixed(1) + ' V ' + (y + len).toFixed(1) +
        '" stroke="' + (color || '#FFFFFF') + '" stroke-width="' + width +
        '" stroke-linecap="round" opacity="' + alpha.toFixed(3) + '"/>'
      );
    }

    /**
     * Deterministic star plates, all built once and reused as CSS backgrounds:
     *   far  — dense pinpricks over the whole frame
     *   band — the galactic arm, soft gaussian spread around bandY()
     *   near — a few foreground stars with hairlines that glint, plus nothing
     *          else: no discs, no rings. This plate drifts, which sells depth.
     */
    function starWall(kind) {
      var rnd = mulberry32(kind === 'far' ? 20260111 : kind === 'band' ? 7723 : 99173);
      var count = kind === 'far' ? 460 : kind === 'band' ? 320 : 20;
      var parts = [];
      var guard = 0;
      var placed = 0;
      while (placed < count && guard < count * 12) {
        guard += 1;
        var x = rnd() * STAR_W;
        var y;
        if (kind === 'band') {
          var jitter = (rnd() + rnd() + rnd() - 1.5) * 0.085;
          y = bandY(x) + jitter * STAR_H;
          if (y < -10 || y > STAR_H + 10) continue;
        } else if (kind === 'near') {
          y = STAR_H * (0.08 + rnd() * 0.84);
        } else {
          y = rnd() * STAR_H;
        }
        var r = kind === 'far' ? 0.45 + rnd() * 0.75 : kind === 'band' ? 0.55 + rnd() * 1.15 : 1.9 + rnd() * 1.3;
        var a = kind === 'far' ? 0.12 + rnd() * 0.38 : kind === 'band' ? 0.16 + rnd() * 0.46 : 0.6 + rnd() * 0.35;
        // six temperatures: white core, then ice, periwinkle, violet, gold, rose.
        // The distant field keeps the coloured ones as a minority (confetti if not);
        // the handful of foreground stars cycle the full wheel so the sky has hue.
        var pick = rnd();
        var slot =
          pick < 0.44 ? 0 :
          pick < 0.64 ? 1 :
          pick < 0.76 ? 2 :
          pick < 0.86 ? 3 :
          pick < 0.94 ? 4 : 5;
        var tint = kind === 'near' ? STAR_PALETTE[placed % STAR_PALETTE.length] : STAR_PALETTE[slot];
        parts.push(
          '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(2) +
            '" fill="' + tint + '" opacity="' + a.toFixed(2) + '"/>',
        );
        var glint = kind === 'near' ? 1 : rnd() < (kind === 'band' ? 0.09 : 0.03);
        if (glint) {
          parts.push(
            spark(
              x, y, r * (kind === 'near' ? 6.5 : 4.2),
              kind === 'near' ? 0.5 : 0.42,
              a * (kind === 'near' ? 0.34 : 0.26),
              tint,
            ),
          );
        }
        placed += 1;
      }
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + STAR_W + ' ' + STAR_H +
        '" width="' + STAR_W + '" height="' + STAR_H + '">' + parts.join('') + '</svg>';
      return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    }

    var FIELD_URL = starWall('far');
    var BAND_URL = starWall('band');
    var NEAR_URL = starWall('near');

    // ══════════════════════════════════════════════════════════════════════
    // 4. Stylesheet
    // ══════════════════════════════════════════════════════════════════════
    var CSS = [
      /* ── atmosphere ───────────────────────────────────────────────── */
      'body{--ae-glow-a:rgba(30,102,201,.055);--ae-glow-b:rgba(120,140,170,.05);--ae-vignette:rgba(9,17,30,.05);}',
      'body[data-ds-dark-theme]{--ae-glow-a:rgba(143,199,255,.07);--ae-glow-b:rgba(158,172,190,.055);--ae-vignette:rgba(0,0,0,.26);}',
      '.ae-veil{position:fixed;inset:0;pointer-events:none;z-index:1;',
      'background:radial-gradient(120% 62% at 50% -12%,var(--ae-glow-a),transparent 62%),',
      'radial-gradient(72% 52% at 104% 112%,var(--ae-glow-b),transparent 66%);',
      'box-shadow:inset 0 0 120px -24px var(--ae-vignette);}',

      /* ── deep cosmos — one blended group, three painted layers ────── */
      'body{--ae-sky-gain:.8;',
      '--ae-field:' + FIELD_URL + ';',
      '--ae-near:' + NEAR_URL + ';',
      '--ae-band:radial-gradient(40% 25% at 12% 90%,rgba(64,190,224,.26),transparent 74%),',
      'radial-gradient(30% 19% at 22% 80%,rgba(96,150,255,.24),transparent 76%),',
      'radial-gradient(24% 16% at 31% 68%,rgba(150,118,255,.22),transparent 74%),',
      'radial-gradient(30% 20% at 40% 57%,rgba(206,168,255,.24),transparent 76%),',
      'radial-gradient(20% 13% at 48% 48%,rgba(255,168,214,.20),transparent 74%),',
      'radial-gradient(22% 14% at 55% 42%,rgba(255,214,150,.22),transparent 74%),',
      'radial-gradient(30% 19% at 63% 34%,rgba(196,160,255,.23),transparent 76%),',
      'radial-gradient(24% 16% at 71% 26%,rgba(120,140,255,.22),transparent 74%),',
      'radial-gradient(32% 21% at 80% 18%,rgba(96,200,236,.20),transparent 76%),',
      'radial-gradient(26% 17% at 90% 9%,rgba(136,170,255,.17),transparent 78%),',
      'radial-gradient(58% 40% at 50% 52%,rgba(58,104,180,.16),transparent 82%),',
      'linear-gradient(112deg,transparent 4%,rgba(90,214,232,.075) 20%,rgba(140,170,255,.09) 36%,rgba(238,222,255,.11) 48%,rgba(206,168,255,.09) 60%,rgba(255,178,206,.07) 72%,rgba(240,206,150,.05) 82%,transparent 96%);}',
      'body[data-ds-dark-theme]{--ae-sky-gain:.95;}',
      'body:not([data-ds-dark-theme]){--ae-band:radial-gradient(38% 23% at 13% 89%,rgba(70,150,190,.09),transparent 74%),',
      'radial-gradient(28% 18% at 24% 78%,rgba(96,122,196,.08),transparent 74%),',
      'radial-gradient(24% 15% at 33% 66%,rgba(126,104,196,.075),transparent 72%),',
      'radial-gradient(28% 18% at 43% 56%,rgba(150,126,206,.08),transparent 74%),',
      'radial-gradient(20% 13% at 52% 47%,rgba(190,120,160,.06),transparent 72%),',
      'radial-gradient(26% 17% at 62% 38%,rgba(132,116,200,.07),transparent 74%),',
      'radial-gradient(24% 15% at 71% 29%,rgba(90,120,180,.065),transparent 72%),',
      'radial-gradient(28% 18% at 81% 20%,rgba(84,160,190,.07),transparent 74%),',
      'radial-gradient(46% 34% at 50% 52%,rgba(80,104,150,.055),transparent 78%),',
      'linear-gradient(112deg,transparent 10%,rgba(96,168,196,.05) 28%,rgba(120,140,200,.06) 44%,rgba(150,130,200,.055) 60%,transparent 88%);}',
      'body:not([data-ds-dark-theme]) .ae-sky{mix-blend-mode:multiply;}',
      'body:not([data-ds-dark-theme]) .ae-sky-twinkle,body:not([data-ds-dark-theme]) .ae-sky-near{display:none;}',
      'body:not([data-ds-dark-theme]) .ae-sky-field{opacity:calc(var(--ae-sky-gain)*.5);}',
      '.ae-sky{position:fixed;inset:0;z-index:2;overflow:hidden;pointer-events:none;mix-blend-mode:screen;}',
      '.ae-sky>div{position:absolute;inset:0;pointer-events:none;background-size:cover;background-position:50% 50%;background-repeat:no-repeat;}',
      '.ae-sky-field{background-image:var(--ae-band),var(--ae-field);background-size:100% 100%,cover;opacity:calc(var(--ae-sky-gain)*.97);}',
      '.ae-sky-twinkle{background-image:' + BAND_URL + ';opacity:calc(var(--ae-sky-gain)*.72);animation:ae-twinkle 17s ease-in-out infinite alternate;}',
      '@keyframes ae-twinkle{from{opacity:calc(var(--ae-sky-gain)*.34);}to{opacity:calc(var(--ae-sky-gain)*.88);}}',
      '.ae-sky-near{background-image:var(--ae-near);opacity:calc(var(--ae-sky-gain)*.96);animation:ae-float 190s ease-in-out infinite alternate;}',
      '@keyframes ae-float{from{transform:translate3d(2.2%,1.6%,0) scale(1.05);}to{transform:translate3d(-1.8%,-1.4%,0) scale(1.07);}}',

      /* ── global details that tokens cannot reach ──────────────────── */
      'html{scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;}',
      '::selection{background:var(--dsw-alias-bg-document-selection);color:var(--dsw-alias-label-primary);}',
      '::-webkit-scrollbar{width:10px;height:10px;}',
      '::-webkit-scrollbar-track{background:transparent;}',
      '::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2);border:3px solid transparent;background-clip:content-box;border-radius:999px;}',
      '::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l2);border:3px solid transparent;background-clip:content-box;}',
      '::-webkit-scrollbar-corner{background:transparent;}',

      /* ── console shell ────────────────────────────────────────────── */
      '.ae-page{display:flex;flex-direction:column;gap:26px;width:100%;max-width:760px;padding:4px 0 8px;font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary);',
      'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif;}',
      '.ae-head{display:flex;align-items:center;gap:12px;}',
      '.ae-mark{flex:0 0 auto;width:36px;height:36px;border-radius:11px;border:.5px solid var(--dsw-alias-border-l2);',
      'background:var(--dsw-alias-bg-layer-1);display:flex;align-items:center;justify-content:center;}',
      '.ae-word{font-size:12px;font-weight:600;letter-spacing:.18em;color:var(--dsw-alias-label-primary);}',
      '.ae-sub{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);margin-top:3px;}',
      '.ae-ver{margin-left:auto;font-size:10px;letter-spacing:.06em;color:var(--dsw-alias-label-caption);',
      'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}',

      /* ── rows (host-shaped: hairline between, none at the end) ────── */
      '.ae-rows{display:flex;flex-direction:column;border-top:.5px solid var(--dsw-alias-border-l2);}',
      '.ae-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2);}',
      '.ae-rowmain{display:flex;flex-direction:column;gap:4px;min-width:0;}',
      '.ae-title{font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary);}',
      '.ae-desc{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);}',

      /* ── switch (copied primitive, own prefix) ───────────────────── */
      '.ae-switch{position:relative;flex:0 0 auto;width:36px;height:20px;padding:2px;border:0;border-radius:999px;',
      'background:var(--dsw-alias-border-l3);cursor:pointer;transition:background 160ms cubic-bezier(.16,1,.3,1);}',
      '.ae-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary);}',
      '.ae-knob{display:block;width:16px;height:16px;border-radius:999px;background:var(--dsw-alias-switch-thumb);',
      'transition:transform 160ms cubic-bezier(.16,1,.3,1);}',
      '.ae-switch[aria-checked="true"] .ae-knob{transform:translateX(16px);}',
      '.ae-switch:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;}',
      '.ae-switch:disabled{opacity:.5;cursor:default;}',

      /* ── segmented accent picker ─────────────────────────────────── */
      '.ae-seg{display:inline-flex;gap:2px;padding:2px;border-radius:10px;border:.5px solid var(--dsw-alias-border-l2);',
      'background:var(--dsw-alias-interactive-bg-hover);}',
      '.ae-segbtn{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:0;border-radius:8px;',
      'background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;',
      'transition:background 120ms ease-out,color 120ms ease-out;}',
      '.ae-segbtn[aria-pressed="true"]{background:var(--dsw-alias-button-floating-fill);color:var(--dsw-alias-label-primary);',
      'box-shadow:0 1px 2px rgba(0,0,0,.14);}',
      '.ae-segbtn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;}',
      '.ae-dot{width:10px;height:10px;border-radius:999px;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.2);}',

      /* ── section heading (small caps) ────────────────────────────── */
      '.ae-group{display:flex;flex-direction:column;gap:10px;}',
      '.ae-group>h4{margin:0;font-size:10px;font-weight:500;line-height:14px;letter-spacing:.14em;',
      'text-transform:uppercase;color:var(--dsw-alias-label-tertiary);}',
      '.ae-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);margin:-4px 0 2px;}',

      /* ── live preview board ──────────────────────────────────────── */
      '.ae-board{border:.5px solid var(--dsw-alias-border-l2);border-radius:14px;padding:16px;',
      'background-color:var(--dsw-alias-bg-layer-1);',
      'background-image:radial-gradient(var(--dsw-alias-border-l1) 1px,transparent 1px);background-size:12px 12px;',
      'display:flex;flex-direction:column;gap:14px;}',
      '.ae-btns{display:flex;flex-wrap:wrap;align-items:center;gap:10px;}',
      '.ae-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:32px;padding:0 14px;',
      'border-radius:10px;border:.5px solid transparent;font:inherit;font-size:13px;cursor:pointer;',
      'transition:background 140ms ease-out,border-color 140ms ease-out,transform 90ms ease-out;}',
      '.ae-btn:active{transform:translateY(.5px);}',
      '.ae-btn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;}',
      '.ae-btn--primary{border:0;background:var(--dsw-alias-button-primary-fill);',
      'color:var(--dsw-alias-label-primary-foreground);',
      'box-shadow:0 1px 2px rgba(0,0,0,.22),inset 0 .5px 0 rgba(255,255,255,.4);}',
      '.ae-btn--primary:hover{background:var(--dsw-alias-button-primary-hover);}',
      '.ae-btn--ghost{border:.5px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-primary);}',
      '.ae-btn--ghost:hover{background:var(--dsw-alias-interactive-bg-hover);}',
      '.ae-input{height:32px;min-width:0;flex:1 1 160px;padding:0 10px;border-radius:10px;',
      'border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-specific-input-major);',
      'color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;transition:border-color 140ms ease-out;}',
      '.ae-input::placeholder{color:var(--dsw-alias-label-tertiary);}',
      '.ae-input:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px;}',
      '.ae-card{border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;padding:12px;',
      'background:var(--dsw-alias-bg-layer-2);display:flex;flex-direction:column;gap:4px;}',
      '.ae-card>b{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);}',
      '.ae-card>span{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);}',
      '.ae-chip{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px;border-radius:999px;',
      'border:.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);',
      'font-size:11px;letter-spacing:.02em;}',
      '.ae-live{width:5px;height:5px;border-radius:999px;background:var(--dsw-alias-state-success-primary);',
      'animation:ae-pulse 4800ms ease-out infinite;}',
      '@keyframes ae-pulse{0%,86%{box-shadow:0 0 0 0 color-mix(in srgb,var(--dsw-alias-state-success-primary) 45%,transparent);}',
      '100%{box-shadow:0 0 0 6px transparent;}}',

      /* ── token palette ───────────────────────────────────────────── */
      '.ae-chips{display:flex;flex-wrap:wrap;gap:8px;}',
      '.ae-swatch{display:flex;align-items:center;gap:8px;height:30px;padding:0 10px 0 6px;border-radius:8px;',
      'border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);}',
      '.ae-swatch i{width:18px;height:18px;border-radius:6px;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.16);}',
      '.ae-swatch b{font-size:11px;font-weight:500;color:var(--dsw-alias-label-primary);}',
      '.ae-swatch span{font-size:10px;color:var(--dsw-alias-label-tertiary);',
      'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}',

      /* ── principles ─────────────────────────────────────────────── */
      '.ae-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;}',
      '.ae-list li{display:flex;gap:10px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);}',
      '.ae-list li:before{content:"";flex:0 0 auto;width:5px;height:5px;margin-top:6px;border-radius:999px;',
      'background:var(--dsw-alias-label-tertiary);}',

      '.ae-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;',
      'padding-top:14px;border-top:.5px solid var(--dsw-alias-border-l2);',
      'font-size:11px;line-height:16px;color:var(--dsw-alias-label-caption);}',
      '.ae-reset{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;',
      'cursor:pointer;text-decoration:underline;text-underline-offset:2px;}',
      '.ae-reset:hover{color:var(--dsw-alias-label-primary);}',
      '.ae-reset:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;}',

      '@media (max-width:560px){.ae-row{flex-direction:column;align-items:flex-start;gap:10px;}',
      '.ae-row>.ae-seg,.ae-row>.ae-switch{flex:0 0 auto;}}',

      /* ── glass platform — the left workspace floats on its own sheet ─ */
      'body[data-ae-glass="on"],body[data-ae-rows="on"]{',
      '--ae-plat-bg:linear-gradient(168deg,rgba(255,255,255,.055),rgba(255,255,255,.014) 34%,rgba(255,255,255,0) 64%),',
      'color-mix(in srgb,var(--dsw-specific-sidebar-fill) 80%,transparent);',
      '--ae-plat-gap:clamp(6px,1.6%,10px);',
      '--ae-card-inset:4px;',
      '--ae-plat-ring:rgba(255,255,255,.13);--ae-plat-hi:rgba(255,255,255,.11);',
      '--ae-plat-edge:inset 0 -1px 0 rgba(0,0,0,.38);',
      '--ae-plat-shadow:0 38px 74px -28px rgba(0,0,0,.88),0 14px 30px -14px rgba(0,0,0,.66),0 3px 8px -2px rgba(0,0,0,.52);',
      '--ae-card-bg:color-mix(in srgb,var(--dsw-alias-bg-layer-2) 46%,transparent);',
      '--ae-card-ring:rgba(255,255,255,.08);--ae-card-hi:inset 0 1px 0 rgba(255,255,255,.06);',
      '--ae-card-shadow:0 10px 22px -18px rgba(0,0,0,.92);',
      '--ae-card-hover-bg:color-mix(in srgb,var(--dsw-alias-bg-layer-2) 68%,transparent);',
      '--ae-card-hover-ring:rgba(255,255,255,.17);--ae-card-hover-shadow:0 22px 40px -18px rgba(0,0,0,.9);',
      '--ae-card-sel-bg:color-mix(in srgb,var(--dsw-alias-state-business-primary) 16%,transparent);',
      '--ae-card-sel-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 38%,transparent);',
      /* selected conversation reads as an inverted surface: in the dark theme the
         card turns near-white, in the light theme it turns near-black */
      '--ae-card-sel-ink:#FFFFFF;--ae-card-sel-ink-fg:#0A0E14;',
      '--ae-card-sel-ink-hi:inset 0 1px 0 rgba(255,255,255,.55);',
      '--ae-card-sel-ink-shadow:0 0 0 1px rgba(255,255,255,.34),0 12px 26px -14px rgba(0,0,0,.72);',
      /* workspace rows are containers, sessions are leaves: the container
         gets an accent-tinted chip + plaque so the folder reads first */
      '--ae-ws-bg:color-mix(in srgb,var(--dsw-alias-state-business-primary) 18%,var(--ae-card-bg));',
      '--ae-ws-bg-hover:color-mix(in srgb,var(--dsw-alias-state-business-primary) 20%,var(--ae-card-hover-bg));',
      '--ae-ws-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 42%,transparent);',
      '--ae-ws-plaque:color-mix(in srgb,var(--dsw-alias-state-business-primary) 16%,transparent);',
      '--ae-ws-plaque-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 28%,transparent);',
      '--ae-ws-glow:drop-shadow(0 0 5px color-mix(in srgb,var(--dsw-alias-state-business-primary) 55%,transparent));}',
      'body[data-ae-glass="on"]:not([data-ds-dark-theme]),body[data-ae-rows="on"]:not([data-ds-dark-theme]){',
      '--ae-plat-bg:linear-gradient(168deg,rgba(255,255,255,.78),rgba(255,255,255,.5) 38%,rgba(255,255,255,.34) 70%,rgba(255,255,255,.44)),',
      'color-mix(in srgb,var(--dsw-specific-sidebar-fill) 72%,transparent);',
      '--ae-plat-gap:clamp(6px,1.6%,10px);',
      '--ae-card-inset:4px;',
      '--ae-plat-ring:rgba(15,23,42,.15);--ae-plat-hi:rgba(255,255,255,.95);',
      '--ae-plat-edge:inset 0 -1px 0 rgba(15,23,42,.07);',
      '--ae-plat-shadow:0 32px 62px -28px rgba(15,23,42,.36),0 10px 22px -14px rgba(15,23,42,.16),0 2px 5px -1px rgba(15,23,42,.10);',
      '--ae-card-bg:rgba(255,255,255,.66);--ae-card-ring:rgba(15,23,42,.08);',
      '--ae-card-hi:inset 0 1px 0 rgba(255,255,255,.95);',
      '--ae-card-shadow:0 8px 18px -14px rgba(15,23,42,.32);',
      '--ae-card-hover-bg:rgba(255,255,255,.94);--ae-card-hover-ring:rgba(15,23,42,.15);',
      '--ae-card-hover-shadow:0 20px 36px -18px rgba(15,23,42,.4);',
      '--ae-card-sel-bg:color-mix(in srgb,var(--dsw-alias-state-business-primary) 11%,#fff);',
      '--ae-card-sel-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 34%,transparent);',
      '--ae-card-sel-ink:#FFFFFF;--ae-card-sel-ink-fg:#0B1016;',
      '--ae-card-sel-ink-hi:inset 0 1px 0 #fff;',
      '--ae-card-sel-ink-shadow:0 0 0 1.5px rgba(15,23,42,.22),0 14px 28px -16px rgba(15,23,42,.34);',
      '--ae-ws-bg:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%,var(--ae-card-bg));',
      '--ae-ws-bg-hover:color-mix(in srgb,var(--dsw-alias-state-business-primary) 15%,var(--ae-card-hover-bg));',
      '--ae-ws-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 36%,transparent);',
      '--ae-ws-plaque:color-mix(in srgb,var(--dsw-alias-state-business-primary) 12%,#FFFFFF);',
      '--ae-ws-plaque-ring:color-mix(in srgb,var(--dsw-alias-state-business-primary) 30%,transparent);',
      '--ae-ws-glow:drop-shadow(0 1px 3px color-mix(in srgb,var(--dsw-alias-state-business-primary) 40%,transparent));}',
      /* The sheet must never resize the host column itself: the column keeps
         its grid track and only gains padding, so every child reflows inside
         it and stays anchored to the sheet edge. The glass surface is a
         separate, absolutely positioned layer underneath the content. */
      'body[data-ae-glass="on"] .ae-sidebar{position:relative !important;isolation:isolate;',
      'box-sizing:border-box !important;',
      'margin:var(--ae-plat-gap) !important;',
      'padding:clamp(5px,1.1%,8px) clamp(9px,3.2%,16px) clamp(11px,2.4%,16px) !important;',
      'background:transparent !important;border:0 !important;border-radius:0 !important;',
      'overflow:visible !important;}',
      /* one gap variable drives every plate edge: the window gutter, the gap to
         the conversation column and the right rail gutter are then identical
         by construction instead of relying on two different clamps. */
      'body[data-ae-glass="on"] .ae-sidebar:before{content:"";position:absolute;z-index:-1;',
      'inset:0;',
      'border-radius:clamp(12px,5%,18px);background:var(--ae-plat-bg);',
      'box-shadow:0 0 0 1px var(--ae-plat-ring),var(--ae-plat-shadow),inset 0 1px 0 var(--ae-plat-hi),var(--ae-plat-edge);',
      'backdrop-filter:blur(26px) saturate(140%);-webkit-backdrop-filter:blur(26px) saturate(140%);',
      'pointer-events:none;}',
      'body[data-ae-glass="on"] .ae-sidebar>*{background:transparent !important;}',
      /* Keep the host's own collapsed padding (18px 10px 6px): the 36px rail
         buttons are positioned against it, so shrinking it moved every icon in
         the rail off its original grid. Only the glass layer is inset. */
      'body[data-ae-glass="on"] [data-sidebar-collapsed]>.ae-sidebar{padding:18px 10px 6px !important;margin:clamp(4px,.9%,6px) !important;}',
      'body[data-ae-glass="on"] [data-sidebar-collapsed]>.ae-sidebar:before{inset:0;border-radius:12px;}',
      /* Card surfaces are painted by a child layer, never by the row box.
         Reason: the host row's own box is part of the layout grid (3px
         paint-inset border + 8/9px padding), so any margin, padding or radius
         we put on it moves the host icons. A ::before inset from the row gives
         the same rounded card, keeps the icon column pixel-identical to the
         host, and — since the inset is equal on both sides — is symmetric even
         if the host list track is a hair off. */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]{position:relative;margin-inline:0 !important;',
      'background:transparent !important;box-shadow:none !important;border-radius:0;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]:before{content:"";position:absolute;z-index:-1;',
      'inset:1px calc(var(--ae-card-inset,4px) - var(--ae-ring-right-fix,0px)) 1px var(--ae-card-inset,4px);',
      'border-radius:16px;background:var(--ae-card-bg);',
      'box-shadow:0 0 0 1px var(--ae-card-ring),var(--ae-card-hi),var(--ae-card-shadow);',
      'transition:transform 220ms cubic-bezier(.16,1,.3,1),box-shadow 220ms cubic-bezier(.16,1,.3,1),',
      'background-color 220ms ease-out;}',
      /* Selected rows paint on the row box itself: the paint layer above can
         be drowned by the host's own selected background, and a row box is the
         one surface we know always renders. Its 3px transparent inline border
         plus background-clip:padding-box keeps the white card inset from the
         glass edge, and border-radius turns the frame round. */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key][aria-selected="true"]{',
      'background-color:var(--ae-card-sel-ink) !important;background-clip:padding-box !important;',
      'border-radius:16px !important;color:var(--ae-card-sel-ink-fg) !important;',
      'box-shadow:var(--ae-card-sel-ink-hi),var(--ae-card-sel-ink-shadow) !important;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key][aria-selected="true"]:before{display:none !important;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key][aria-selected="true"] :where(*){',
      'color:inherit !important;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key][aria-selected="true"] :where(svg){opacity:.9;}',
      /* Hover never touches the selected row: the selected surface is an
         inverted ink card, and an equal-specificity hover background used to
         override it while the text stayed inverted, which made the label
         unreadable ("selected then hovered = invisible text"). */
      '@media (hover:hover){body[data-ae-rows="on"] .ae-sidebar [data-row-key]:not([aria-selected="true"]):hover:before{',
      'transform:translateY(-2px) scale(1.008);background:var(--ae-card-hover-bg);',
      'box-shadow:0 0 0 1px var(--ae-card-hover-ring),var(--ae-card-hi),var(--ae-card-hover-shadow);}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"]:not([aria-selected="true"]):hover:before{',
      'background:var(--ae-ws-bg-hover);box-shadow:0 0 0 1px var(--ae-ws-ring),inset 0 1px 0 rgba(255,255,255,.12),',
      '0 20px 34px -18px rgba(0,0,0,.9);}}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key][aria-selected="true"]:hover{',
      'box-shadow:var(--ae-card-sel-ink-hi),0 0 0 1px rgba(255,255,255,.42),',
      '0 18px 34px -16px rgba(0,0,0,.8) !important;}',
      /* ── workspace vs conversation: containers lead, leaves follow ─── */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"]:before{',
      'border-radius:16px;background:var(--ae-ws-bg);',
      'box-shadow:0 0 0 1px var(--ae-ws-ring),inset 0 1px 0 rgba(255,255,255,.1),',
      '0 14px 26px -18px rgba(0,0,0,.85);}',
      'body[data-ae-rows="on"]:not([data-ds-dark-theme]) .ae-sidebar [data-row-key^="workspace:"]:before{',
      'box-shadow:0 0 0 1px var(--ae-ws-ring),inset 0 1px 0 #fff,0 12px 22px -16px rgba(15,23,42,.34);}',
      '@media (hover:hover){body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"]:not([aria-selected="true"]):hover:before{',
      'transform:translateY(-3px);}}',
      /* a selected container reads with the same ink card as a leaf, so the
         selection state is legible in both kinds of row */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"][aria-selected="true"]:before{',
      'background:var(--ae-card-sel-ink);box-shadow:var(--ae-card-sel-ink-hi),var(--ae-card-sel-ink-shadow);}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"][aria-selected="true"] > span:first-child{',
      'background:transparent;box-shadow:none;color:inherit;}',
      /* The folder slot is 16px wide in the host grid. The plaque is drawn at
         18px but the slot keeps its original 16px advance (negative inline
         margins on both sides), so the icon centre and the label start of a
         workspace row stay exactly on the same column as a session row. */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"] > span:first-child{',
      'width:18px;height:18px;margin-inline:-1px;border-radius:6px;',
      'display:inline-flex;align-items:center;justify-content:center;',
      'background:var(--ae-ws-plaque);color:var(--dsw-alias-state-business-primary);',
      'box-shadow:inset 0 0 0 1px var(--ae-ws-plaque-ring);}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"] > span:first-child svg{',
      'width:13px;height:13px;filter:var(--ae-ws-glow);}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="workspace:"] > span:nth-child(3){',
      'font-weight:600;letter-spacing:-0.005em;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key^="overflow:"]:before{display:none;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]:focus-visible{',
      'outline:2px solid var(--dsw-focus-ring-color);outline-offset:-3px;}',
      /* The host scroll area is a 4px | 1fr | (inline-padding - 2px) grid whose
         negative inline margins land the middle track exactly on the column
         padding, so the list is already symmetric. An extra inline margin on
         the tree would narrow that track and slide the icon column left, so no
         tree margin is applied here (a legacy 6–8px rule was removed).
         Leading slots are pinned to the host 16×20 box so folder, status and
         avatar glyphs share one vertical centre line at any row height. */
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]>span:first-child{',
      'flex:none;display:inline-flex;align-items:center;justify-content:center;align-self:center;}',
      /* right rail: the docked right panel is absolutely positioned inside its
         column, so it is inset and rounded here instead of padding the column
         (padding cannot move an absolutely positioned panel). */
      'body[data-ae-glass="on"] .ae-rail{background:transparent !important;}',
      'body[data-ae-glass="on"] .ae-rail [data-sidebar-right-panel]:not([data-sidebar-right-panel="fullscreen"]){',
      'top:var(--ae-plat-gap) !important;bottom:var(--ae-plat-gap) !important;',
      'right:var(--ae-plat-gap) !important;left:auto !important;',
      'width:max(0px, calc(100% - var(--ae-plat-gap) * 2)) !important;',
      'border-radius:clamp(13px,4%,17px) !important;overflow:hidden !important;',
      'background:var(--ae-plat-bg) !important;',
      'box-shadow:0 0 0 1px var(--ae-plat-ring),var(--ae-plat-shadow),inset 0 1px 0 var(--ae-plat-hi),var(--ae-plat-edge);',
      'backdrop-filter:blur(26px) saturate(140%);-webkit-backdrop-filter:blur(26px) saturate(140%);}',
      'body[data-ae-glass="on"] .ae-rail [data-dockkit-host=dock],',
      'body[data-ae-glass="on"] .ae-rail [data-dockkit-pane],',
      'body[data-ae-glass="on"] .ae-rail [data-dockkit-empty]{background:transparent !important;}',

      /* ── depth presets ──────────────────────────────────────────────
         Depth is a light layer, not a layout: it only re-tunes rim light,
         plate shadow and card elevation, so switching it can never move a
         control or re-flow the list. */
      'body[data-ae-rows="on"]{--ae-plat-depth:0;}',
      'body[data-ae-rows="on"][data-ae-depth="soft"]{',
      '--ae-plat-ring:rgba(255,255,255,.09);--ae-plat-hi:rgba(255,255,255,.07);',
      '--ae-plat-shadow:0 22px 44px -26px rgba(0,0,0,.7),0 8px 18px -12px rgba(0,0,0,.5);',
      '--ae-card-shadow:0 6px 14px -12px rgba(0,0,0,.7);}',
      'body[data-ae-rows="on"][data-ae-depth="normal"]{--ae-plat-depth:1;}',
      'body[data-ae-rows="on"][data-ae-depth="strong"]{',
      '--ae-plat-ring:rgba(255,255,255,.23);--ae-plat-hi:rgba(255,255,255,.2);',
      '--ae-plat-edge:inset 0 -1px 0 rgba(0,0,0,.55),inset 0 -14px 24px -18px rgba(0,0,0,.5);',
      '--ae-plat-shadow:0 54px 104px -32px rgba(0,0,0,.98),0 24px 48px -20px rgba(0,0,0,.86),0 8px 16px -4px rgba(0,0,0,.7);',
      '--ae-card-ring:rgba(255,255,255,.13);--ae-card-hi:inset 0 1px 0 rgba(255,255,255,.14);',
      '--ae-card-shadow:0 22px 40px -20px rgba(0,0,0,.98),0 6px 12px -8px rgba(0,0,0,.66);}',
      'body[data-ae-rows="on"]:not([data-ds-dark-theme])[data-ae-depth="soft"]{',
      '--ae-plat-ring:rgba(15,23,42,.12);--ae-plat-shadow:0 18px 36px -24px rgba(15,23,42,.28),0 6px 14px -10px rgba(15,23,42,.14);',
      '--ae-card-shadow:0 5px 12px -10px rgba(15,23,42,.3);}',
      'body[data-ae-rows="on"]:not([data-ds-dark-theme])[data-ae-depth="strong"]{',
      '--ae-plat-ring:rgba(15,23,42,.26);--ae-plat-hi:rgba(255,255,255,.99);',
      '--ae-plat-edge:inset 0 -1px 0 rgba(15,23,42,.14),inset 0 -12px 22px -18px rgba(15,23,42,.16);',
      '--ae-plat-shadow:0 50px 92px -32px rgba(15,23,42,.5),0 18px 38px -18px rgba(15,23,42,.3),0 4px 10px -2px rgba(15,23,42,.16);',
      '--ae-card-ring:rgba(15,23,42,.15);--ae-card-hi:inset 0 1px 0 #fff;',
      '--ae-card-shadow:0 20px 34px -18px rgba(15,23,42,.44),0 5px 10px -6px rgba(15,23,42,.2);}',
      '@media (hover:hover){body[data-ae-rows="on"][data-ae-depth="strong"] .ae-sidebar [data-row-key]:not([aria-selected="true"]):hover:before{',
      'transform:translateY(-3.4px) scale(1.012);}',
      'body[data-ae-rows="on"][data-ae-depth="strong"] .ae-sidebar [data-row-key][aria-selected="true"]:hover:before{',
      'transform:translateY(-3.6px) scale(1.012);}}',

      /* ── conversation surface ───────────────────────────────────────
         The host only rounds the top-left corner of this track; round all
         four and give the sheet a little breathing room, so the conversation
         reads as one calm surface instead of a full-bleed rectangle. Nothing
         inside moves: the column keeps its track, the host keeps scroll and
         the composer. */
      'body[data-ae-main="on"] .ae-main{',
      'border-radius:clamp(13px,1.5vw,19px) !important;overflow:hidden !important;',
      'margin:clamp(4px,.55vw,7px) clamp(5px,.7vw,9px) clamp(4px,.55vw,7px) clamp(5px,.7vw,9px) !important;',
      'box-shadow:0 0 0 1px var(--dsw-alias-border-l1),0 22px 48px -30px rgba(0,0,0,.72);',
      'background-clip:padding-box !important;}',
      'body[data-ae-main="on"]:not([data-ds-dark-theme]) .ae-main{',
      'box-shadow:0 0 0 1px var(--dsw-alias-border-l2),0 20px 42px -30px rgba(15,23,42,.3);}',
      /* ── motion budget: honour the system setting ────────────────── */
      '@media (prefers-reduced-motion:reduce){.ae-switch,.ae-knob,.ae-segbtn,.ae-btn,.ae-input{transition:none;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]:before{transition:none;}',
      'body[data-ae-rows="on"] .ae-sidebar [data-row-key]:hover:before{transform:none;}',
      '.ae-live{animation:none;}',
      '.ae-sky-twinkle{animation:none;opacity:calc(var(--ae-sky-gain)*.6);}','.ae-sky-near{animation:none;}}',
    ].join('\n');

    // ══════════════════════════════════════════════════════════════════════
    // 5. Components
    // ══════════════════════════════════════════════════════════════════════
    function Mark() {
      return h(
        'svg',
        { viewBox: '0 0 64 64', width: 22, height: 22, 'aria-hidden': 'true', style: { display: 'block' } },
        h(
          'defs',
          null,
          h(
            'linearGradient',
            { id: 'ae-mark-metal', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0', stopColor: '#FFFFFF' }),
            h('stop', { offset: '0.45', stopColor: '#E6ECF3' }),
            h('stop', { offset: '1', stopColor: '#8E9CAD' }),
          ),
        ),
        h('circle', {
          cx: 32,
          cy: 32,
          r: 15.5,
          fill: 'none',
          stroke: 'url(#ae-mark-metal)',
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeDasharray: '74 23',
          transform: 'rotate(-58 32 32)',
        }),
        h('circle', { cx: 32, cy: 32, r: 3.4, style: { fill: 'var(--dsw-alias-state-business-primary)' } }),
      );
    }

    function Switch(props) {
      return h(
        'button',
        {
          type: 'button',
          role: 'switch',
          'aria-checked': props.checked ? 'true' : 'false',
          'aria-label': props.label,
          className: 'ae-switch',
          onClick: props.onChange,
        },
        h('span', { className: 'ae-knob' }),
      );
    }

    function AccentPicker(props) {
      return h(
        'div',
        { className: 'ae-seg', role: 'group', 'aria-label': tr('accent') },
        ACCENT_ORDER.map(function (key) {
          var accent = ACCENTS[key];
          return h(
            'button',
            {
              key: key,
              type: 'button',
              className: 'ae-segbtn',
              'aria-pressed': props.value === key ? 'true' : 'false',
              title: accent.label,
              onClick: function () {
                props.onChange(key);
              },
            },
            h('span', { className: 'ae-dot', style: { background: accent.swatch } }),
            accent.label,
          );
        }),
      );
    }

    function Board(props) {
      var accent = ACCENTS[props.accent] || ACCENTS.ice;
      return h(
        'div',
        { className: 'ae-board' },
        h(
          'div',
          { className: 'ae-btns' },
          h('button', { type: 'button', className: 'ae-btn ae-btn--primary' }, tr('previewPrimary')),
          h('button', { type: 'button', className: 'ae-btn ae-btn--ghost' }, tr('previewSecondary')),
          h('span', { className: 'ae-chip' }, h('span', { className: 'ae-live' }), tr('previewLive')),
        ),
        h('input', { className: 'ae-input', placeholder: tr('previewPlaceholder'), readOnly: true, tabIndex: -1 }),
        h(
          'div',
          { className: 'ae-card' },
          h('b', null, tr('previewCardTitle')),
          h('span', null, tr('previewCardDesc')),
        ),
        h(
          'div',
          { className: 'ae-btns' },
          h('span', {
            className: 'ae-dot',
            style: { background: accent.swatch, width: 8, height: 8 },
            'aria-hidden': 'true',
          }),
          h(
            'span',
            { className: 'ae-hint', style: { margin: 0 } },
            accent.label + ' · ' + (props.scheme === 'dark' ? '#8FC7FF' : '#1E66C9'),
          ),
        ),
      );
    }

    function Palette(props) {
      var accent = ACCENTS[props.accent] || ACCENTS.ice;
      var entries = [
        ['bg-base', props.scheme === 'dark' ? '#05070A' : '#F2F4F8'],
        ['surface', props.scheme === 'dark' ? '#0A0E14' : '#FFFFFF'],
        ['line', props.scheme === 'dark' ? '#1D2530' : '#DDE2EA'],
        ['silver', props.scheme === 'dark' ? '#E6ECF3' : '#151B23'],
        ['accent', props.scheme === 'dark' ? accent.dark : accent.light],
        ['ok', props.scheme === 'dark' ? '#72D6A9' : '#1F8F63'],
        ['warn', props.scheme === 'dark' ? '#E8C176' : '#B57311'],
        ['danger', props.scheme === 'dark' ? '#F18585' : '#C23B3B'],
      ];
      return h(
        'div',
        { className: 'ae-chips' },
        entries.map(function (entry) {
          return h(
            'div',
            { key: entry[0], className: 'ae-swatch' },
            h('i', { style: { background: entry[1] } }),
            h('b', null, entry[0]),
            h('span', null, entry[1]),
          );
        }),
      );
    }

    function LevelPicker(props) {
      var keys = ['subtle', 'medium', 'rich'];
      return h(
        'div',
        { className: 'ae-seg', role: 'group', 'aria-label': tr('galaxyLevel') },
        keys.map(function (key) {
          return h(
            'button',
            {
              key: key,
              type: 'button',
              className: 'ae-segbtn',
              'aria-pressed': props.value === key ? 'true' : 'false',
              onClick: function () {
                if (props.value !== key) props.onChange(key);
              },
            },
            tr('level' + key.charAt(0).toUpperCase() + key.slice(1)),
          );
        }),
      );
    }

    function DepthPicker(props) {
      var keys = ['soft', 'normal', 'strong'];
      return h(
        'div',
        { className: 'ae-seg', role: 'group', 'aria-label': tr('depth') },
        keys.map(function (key) {
          return h(
            'button',
            {
              key: key,
              type: 'button',
              className: 'ae-segbtn',
              'aria-pressed': props.value === key ? 'true' : 'false',
              onClick: function () {
                if (props.value !== key) props.onChange(key);
              },
            },
            tr('depth' + key.charAt(0).toUpperCase() + key.slice(1)),
          );
        }),
      );
    }

    function Section() {
      var state = useStore();
      var bump = React.useState(0)[1];
      React.useEffect(function () {
        var service = localeService;
        if (!service || typeof service.subscribe !== 'function') return undefined;
        var off = null;
        try {
          off = service.subscribe(function () {
            bump(function (n) {
              return n + 1;
            });
          });
        } catch (err) {
          return undefined;
        }
        return function () {
          if (typeof off === 'function') off();
        };
      }, []);

      var scheme = 'dark';
      if (typeof document !== 'undefined' && document.body) {
        scheme = document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light';
      }

      return h(
        'div',
        { className: 'ae-page' },
        h(
          'div',
          { className: 'ae-head' },
          h('span', { className: 'ae-mark' }, h(Mark)),
          h(
            'div',
            null,
            h('div', { className: 'ae-word' }, 'AETHER'),
            h('div', { className: 'ae-sub' }, tr('tagline')),
          ),
          h('span', { className: 'ae-ver' }, 'v' + VERSION),
        ),
        h(
          'div',
          { className: 'ae-rows' },
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('enable')),
              h('div', { className: 'ae-desc' }, tr('enableDesc')),
            ),
            h(Switch, {
              checked: state.enabled,
              label: tr('enable'),
              onChange: function () {
                writeStore({ enabled: !state.enabled });
              },
            }),
          ),
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('accent')),
              h('div', { className: 'ae-desc' }, tr('accentDesc')),
            ),
            h(AccentPicker, {
              value: state.accent,
              onChange: function (key) {
                writeStore({ accent: key });
              },
            }),
          ),
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('veil')),
              h('div', { className: 'ae-desc' }, tr('veilDesc')),
            ),
            h(Switch, {
              checked: state.veil,
              label: tr('veil'),
              onChange: function () {
                writeStore({ veil: !state.veil });
              },
            }),
          ),
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('galaxy')),
              h('div', { className: 'ae-desc' }, tr('galaxyDesc')),
            ),
            h(Switch, {
              checked: state.galaxy,
              label: tr('galaxy'),
              onChange: function () {
                writeStore({ galaxy: !state.galaxy });
              },
            }),
          ),
          state.galaxy
            ? h(
                'div',
                { className: 'ae-row' },
                h(
                  'div',
                  { className: 'ae-rowmain' },
                  h('div', { className: 'ae-title' }, tr('galaxyLevel')),
                  h('div', { className: 'ae-desc' }, tr('galaxyLevelDesc')),
                ),
                h(LevelPicker, {
                  value: state.galaxyLevel,
                  onChange: function (key) {
                    writeStore({ galaxyLevel: key });
                  },
                }),
              )
            : null,
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('glass')),
              h('div', { className: 'ae-desc' }, tr('glassDesc')),
            ),
            h(Switch, {
              checked: state.glass,
              label: tr('glass'),
              onChange: function () {
                writeStore({ glass: !state.glass });
              },
            }),
          ),
          h(
            'div',
            { className: 'ae-row' },
            h(
              'div',
              { className: 'ae-rowmain' },
              h('div', { className: 'ae-title' }, tr('depth')),
              h('div', { className: 'ae-desc' }, tr('depthDesc')),
            ),
            h(DepthPicker, {
              value: state.depth,
              onChange: function (key) {
                writeStore({ depth: key });
              },
            }),
          ),
        ),
        h(
          'div',
          { className: 'ae-group' },
          h('h4', null, tr('components')),
          h('div', { className: 'ae-hint' }, tr('componentsDesc')),
          h(Board, { accent: state.accent, scheme: scheme }),
        ),
        h('div', { className: 'ae-group' }, h('h4', null, tr('palette')), h(Palette, { accent: state.accent, scheme: scheme })),
        h(
          'div',
          { className: 'ae-group' },
          h('h4', null, tr('principles')),
          h(
            'ul',
            { className: 'ae-list' },
            h('li', null, tr('principle1')),
            h('li', null, tr('principle2')),
            h('li', null, tr('principle3')),
            h('li', null, tr('principle4')),
          ),
        ),
        h(
          'div',
          { className: 'ae-foot' },
          h('span', null, 'AETHER · ' + tr('version') + ' ' + VERSION + ' · @local/dsh-aether-skin'),
          h(
            'button',
            {
              type: 'button',
              className: 'ae-reset',
              onClick: function () {
                writeStore({
                  enabled: DEFAULTS.enabled,
                  accent: DEFAULTS.accent,
                  veil: DEFAULTS.veil,
                  galaxy: DEFAULTS.galaxy,
                  galaxyLevel: DEFAULTS.galaxyLevel,
                  glass: DEFAULTS.glass,
                  depth: DEFAULTS.depth,
                });
              },
            },
            tr('reset'),
          ),
        ),
      );
    }

    function Veil() {
      var state = useStore();
      if (!state.enabled) return null;
      var layers = [];
      if (state.veil) {
        layers.push(h('div', { key: 'veil', className: 'ae-veil', 'aria-hidden': 'true' }));
      }
      if (state.galaxy) {
        var gain = LEVELS[state.galaxyLevel] || LEVELS.subtle;
        layers.push(
          h(
            'div',
            {
              key: 'sky',
              className: 'ae-sky',
              'aria-hidden': 'true',
              style: { '--ae-sky-gain': String(gain) },
            },
            h('div', { className: 'ae-sky-field' }),
            h('div', { className: 'ae-sky-twinkle' }),
            h('div', { className: 'ae-sky-near' }),
          ),
        );
      }
      if (!layers.length) return null;
      return h(React.Fragment, null, layers);
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. Plugin
    // ══════════════════════════════════════════════════════════════════════
    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        localeService = ctx.locale;

        var tokenLayer = null;

        function releaseTokens() {
          if (tokenLayer !== null) {
            var dispose = tokenLayer;
            tokenLayer = null;
            try {
              dispose();
            } catch (err) {
              console.warn('[aether-skin] token layer release failed', err);
            }
          }
        }

        // ── glass platform: tag the host sidebar column and gate the sheet
        // on a body attribute. Only our own class is added; pointer, focus,
        // selection and drag behaviour stay entirely the host's.
        var hostObserver = null;
        var hostTimer = null;
        var hostTries = 0;
        var hostResize = null;
        var SIDEBAR_CLASS = 'ae-sidebar';
        var RAIL_CLASS = 'ae-rail';
        var MAIN_CLASS = 'ae-main';

        function findSidebar() {
          if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return null;
          var overlay = document.querySelector('[data-shell-overlay]');
          var frame = overlay && overlay.parentElement;
          // Walk up until we reach the real AppFrame: the only ancestor that
          // also hosts the shell's bottom row. This keeps a stray overlay in
          // some nested widget from ever being mistaken for the frame.
          while (frame && typeof frame.querySelector === 'function' && !frame.querySelector('[data-shell-bottom]') && frame.parentElement) {
            frame = frame.parentElement;
          }
          if (!frame || frame === document.body || frame === document.documentElement) return null;

          var tree = typeof frame.querySelector === 'function' ? frame.querySelector('[role="tree"], [data-row-key]') : null;
          var side = null;
          if (tree) {
            // the column that owns the session/workspace list
            var node = tree;
            while (node && node.parentElement && node.parentElement !== frame) node = node.parentElement;
            if (node && node.parentElement === frame) side = node;
          }
          if (!side) {
            var kids = frame.children || [];
            for (var i = 0; i < kids.length; i += 1) {
              var el = kids[i];
              if (!el || el.tagName !== 'DIV') continue;
              if (el.hasAttribute('data-shell-overlay') || el.hasAttribute('data-shell-bottom') || el.hasAttribute('data-shell-leading') || el.hasAttribute('data-sidebar-mask')) continue;
              if (typeof el.querySelector === 'function' && el.querySelector('[data-shell-overlay], [data-shell-bottom]')) continue;
              side = el;
              break;
            }
          }
          if (!side || side === frame) return null;
          // last line of defence: never paint the sheet over the whole shell
          if (typeof side.getBoundingClientRect === 'function' && typeof frame.getBoundingClientRect === 'function') {
            var sideW = side.getBoundingClientRect().width;
            var frameW = frame.getBoundingClientRect().width;
            if (frameW > 0 && sideW > frameW * 0.6) return null;
          }
          return side;
        }

        function tagSidebar() {
          var side = findSidebar();
          if (!side || typeof side.classList === 'undefined') return null;
          if (!side.classList.contains(SIDEBAR_CLASS)) side.classList.add(SIDEBAR_CLASS);
          syncRingFix(side);
          var frame = side.parentElement;
          if (frame && hostObserver === null && typeof MutationObserver !== 'undefined') {
            hostObserver = new MutationObserver(function () {
              var el = tagSidebar();
              if (el !== null) tagMain(el);
            });
            hostObserver.observe(frame, { childList: true });
          }
          if (frame && hostResize === null && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            hostResize = function () {
              var el = tagSidebar();
              if (el !== null) { syncRingFix(el); tagMain(el); }
            };
            window.addEventListener('resize', hostResize);
          }
          return side;
        }

        // The conversation column is the grid track between the sidebar and
        // the right rail. Tag it so the sheet can round its four corners; the
        // host keeps ownership of scroll, focus and the composer.
        function tagMain(side) {
          if (!side) return null;
          var main = side.nextElementSibling;
          if (!main && typeof document !== 'undefined' && typeof document.querySelector === 'function') {
            var rail = document.querySelector('[data-rightbar-col]');
            if (rail) main = rail.previousElementSibling;
          }
          if (!main || main === side || !main.classList) return null;
          if (main.hasAttribute('data-shell-overlay') || main.hasAttribute('data-shell-bottom')) return null;
          if (typeof main.getBoundingClientRect === 'function') {
            var box = main.getBoundingClientRect();
            if (!(box.width > 0)) return null;
          }
          if (!main.classList.contains(MAIN_CLASS)) main.classList.add(MAIN_CLASS);
          return main;
        }

        // The host list keeps a scrollbar gutter on the right
        // (padding-right: calc(inline-padding - scrollbar-width - 2px)). With
        // overlay scrollbars nothing is ever painted there, so the session
        // cards end up visibly tighter / looser on the right than on the left.
        // Instead of guessing that width we measure the real row box once and
        // publish the difference as --ae-ring-right-fix: only the card surface
        // (::before) moves, so the icon column stays on the host grid.
        function syncRingFix(side) {
          if (!side || typeof side.querySelector !== 'function') return;
          var row = side.querySelector('[data-row-key]:not([data-row-key^="overflow:"])');
          if (!row || typeof row.getBoundingClientRect !== 'function') return;
          try {
            var cr = side.getBoundingClientRect();
            var rr = row.getBoundingClientRect();
            if (!(cr.width > 0) || !(rr.width > 0)) return;
            var fix = Math.round((cr.right - rr.right) - (rr.left - cr.left));
            if (!isFinite(fix)) return;
            if (fix > 14) fix = 14;
            if (fix < -14) fix = -14;
            side.style.setProperty('--ae-ring-right-fix', fix + 'px');
          } catch (err) {
            /* layout not ready yet */
          }
        }

        // The right column is a dock track, not a box: its panel is absolutely
        // positioned, so it carries its own stable attribute. Tag every track
        // we find; the sheet CSS only styles a panel that is actually docked.
        function tagRail() {
          if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return 0;
          var cols = document.querySelectorAll('[data-rightbar-col]');
          var tagged = 0;
          for (var i = 0; i < cols.length; i += 1) {
            var el = cols[i];
            if (!el || !el.classList) continue;
            if (!el.classList.contains(RAIL_CLASS)) el.classList.add(RAIL_CLASS);
            tagged += 1;
          }
          return tagged;
        }

        function syncHost() {
          var state = getStore();
          var on = !!(state.enabled && state.glass);
          try {
            if (on) document.body.dataset.aeGlass = 'on';
            else delete document.body.dataset.aeGlass;
            document.body.dataset.aeDepth = normaliseDepth(state.depth);
            if (state.enabled) { document.body.dataset.aeMain = 'on'; document.body.dataset.aeRows = 'on'; }
            else { delete document.body.dataset.aeMain; delete document.body.dataset.aeRows; }
          } catch (err) {
            /* body not mounted yet — the retry below picks it up */
          }
          if (!state.enabled) return;
          tagRail();
          // the frame may mount a tick after the plugin boots — retry briefly
          var side = tagSidebar();
          if (side === null) scheduleTag(0);
          else tagMain(side);
        }

        function scheduleTag(delay) {
          if (hostTimer !== null) return;
          if (typeof window === 'undefined' || typeof window.setTimeout !== 'function') return;
          hostTries = 0;
          var step = function () {
            hostTimer = null;
            try {
              if (document.body.dataset.aeGlass !== 'on' && document.body.dataset.aeMain !== 'on') return;
            } catch (err) {
              return;
            }
            tagRail();
            var tagged = tagSidebar();
            if (tagged !== null) { syncRingFix(tagged); tagMain(tagged); }
            if (tagged === null && hostTries < 40) {
              hostTries += 1;
              hostTimer = window.setTimeout(step, 250);
            }
          };
          hostTimer = window.setTimeout(step, delay);
        }

        function releaseHost() {
          if (hostObserver !== null) {
            try {
              hostObserver.disconnect();
            } catch (err) {
              /* ignore */
            }
            hostObserver = null;
          }
          if (hostResize !== null && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            try {
              window.removeEventListener('resize', hostResize);
            } catch (err) {
              /* ignore */
            }
            hostResize = null;
          }
          if (hostTimer !== null) {
            try {
              window.clearTimeout(hostTimer);
            } catch (err) {
              /* ignore */
            }
            hostTimer = null;
          }
          hostTries = 0;
          try {
            var tagged = document.querySelectorAll('.' + SIDEBAR_CLASS);
            for (var i = 0; i < tagged.length; i += 1) tagged[i].classList.remove(SIDEBAR_CLASS);
            var rails = document.querySelectorAll('.' + RAIL_CLASS);
            for (var j = 0; j < rails.length; j += 1) rails[j].classList.remove(RAIL_CLASS);
            var mains = document.querySelectorAll('.' + MAIN_CLASS);
            for (var k = 0; k < mains.length; k += 1) mains[k].classList.remove(MAIN_CLASS);
            if (document.body) { delete document.body.dataset.aeGlass; delete document.body.dataset.aeMain; delete document.body.dataset.aeRows; }
          } catch (err) {
            /* ignore */
          }
        }

        function syncTokens() {
          var state = getStore();
          releaseTokens();
          if (!state.enabled) return;
          try {
            tokenLayer = ctx.theme.overrideTokens(SOURCE, buildTokens(state.accent));
          } catch (err) {
            console.warn('[aether-skin] token override rejected', err);
          }
        }

        // colour layer + host tagging: apply now, re-apply on every
        // preference change, release on unload
        syncTokens();
        syncHost();
        var unsubscribe = function (next) {
          syncTokens();
          syncHost();
          void next;
        };
        listeners.push(unsubscribe);
        ctx.effect(function () {
          return function () {
            var at = listeners.indexOf(unsubscribe);
            if (at >= 0) listeners.splice(at, 1);
            releaseTokens();
            releaseHost();
          };
        }, 'aether-skin: colour layer');

        // stylesheet (own prefix only), removed with the plugin
        ctx.effect(function () {
          var tag = document.createElement('style');
          tag.dataset.plugin = SOURCE;
          tag.dataset.pluginCss = 'aether-skin';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return function () {
            tag.remove();
          };
        }, 'aether-skin: stylesheet');

        // dictionaries — the console reads the active locale, the registry keeps
        // the strings available to the host the same way first-party plugins do
        ctx.effect(function () {
          var offs = [];
          try {
            offs.push(ctx.locale.register('aetherSkin', 'zh', DICT.zh));
            offs.push(ctx.locale.register('aetherSkin', 'en', DICT.en));
          } catch (err) {
            /* the skin still renders from its inline dictionaries */
          }
          return function () {
            for (var i = 0; i < offs.length; i += 1) {
              try {
                offs[i]();
              } catch (err) {
                /* ignore */
              }
            }
          };
        }, 'aether-skin: dictionaries');

        // atmosphere layer — click-through, above the columns, never a second app
        ctx.slots.inject('shell.overlay', function () {
          return ctx.slots.register(
            { name: 'shell.overlay', id: 'aether-atmosphere', order: 900, label: 'AETHER atmosphere' },
            Veil,
          );
        });

        // console page
        ctx.slots.inject('settings.section', function () {
          return ctx.slots.register(
            {
              name: 'settings.section',
              id: 'aether-skin',
              order: 55,
              label: function () {
                return tr('nav');
              },
            },
            Section,
          );
        });
      },
    };
  },
});
