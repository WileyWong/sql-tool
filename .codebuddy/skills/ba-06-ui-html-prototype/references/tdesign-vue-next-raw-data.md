# TDesign Vue Next Raw Data

## Resource
To enhance the expressiveness of the UI, enrich your pages using the following resources:
Page styles: tailwindcss
Music resources: https://openmusicarchive.org/
Image resources: https://unsplash.com/, example: <example>https://images.unsplash.com/photo-</example>
Placeholder image: https://placehold.co, example: <example>https://placehold.co/{height}x{width}/{background-color}/{text-color}?text={text}</example>
SVG resources: https://www.svgrepo.com/

## Dependency Library
**IMPORTANT: You must install the following library with fixed version below when building a React project, otherwise the project will not run normally**
- Vite: Use `vite` 5 as a development dependency
- TypeScript:  Use `typescript` 5 as a development dependency
- TailwindCSS: Use `tailwindcss` 3.4.17, `tailwind-merge`: "^2.5.5", `tailwindcss-animate`: "^1.0.7"
- PostCSS: Use `postcss` 8.5 as a development dependency
- autoprefixer: Use `autoprefixer` ^10.4.20.
- Common Icon: Use `lucide-vue-next` as a development dependency.
- Brand Icon: Use ` @fortawesome/fontawesome-svg-core`, ` @fortawesome/free-brands-svg-icons` and `@fortawesome/vue-fontawesome` as a development dependency.
- vue-echarts: Use `vue-echarts` library create charts and graphs: `npm install vue-echarts`

# Icon Guidelines

## Common Icon
You can use 'lucide-vue-next' to add icons, for example:
```vue
import { Home } from 'lucide-vue-next';
// ...
<Home />
// ...
```

There are some common icon names:
```vue
import {
  Home, User, Users, Search, Menu, Settings, Bell, Heart, Star, Bookmark, Camera, Image, Video, Music, Mic, Volume, Play, Pause, Stop, SkipForward,
  SkipBack, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowLeft,S ArrowRight, ArrowUp, ArrowDown, Upload, Download, Share, Edit, Trash,
  Plus, Minus, Check, X, AlertCircle, Info, HelpCircle, Eye, EyeOff, Lock, Unlock, Key, Calendar, Clock, Map, Pin, Location, Globe, Phone,
  Mail, MessageCircle, MessageSquare, Send, File, Folder, Paperclip, Printer, DownloadCloud, UploadCloud, Cloud, Wifi, Bluetooth, Battery,
  Sun, Moon, Zap, Flame, Umbrella, ShoppingCart, CreditCard, DollarSign, Tag, Gift, Package, Truck, Briefcase, Clipboard, List, Filter, Sliders,
  BarChart, PieChart, LineChart, TrendingUp, TrendingDown, Activity, Database, Server, Code, Terminal, GitBranch, GitCommit, GitMerge,
  GitPullRequest, Bug, Shield, Award, Trophy, Globe2, Book, Bookmark, Layers, Grid, Layout, Columns, Rows
} from 'lucide-vue-next'

## Brand Icon
If You need Brand Icon, you can use `@fortawesome` to install brand icon.
- Install
Install `@fortawesome` dependencies.
``` sh
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/vue-fontawesome
```

- Register
Register the icon you need in the `main.ts` file.
```vue
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faGithub)

app.component('font-awesome-icon', FontAwesomeIcon)
```

- Use
Use the icon in the component you need.
```vue
<font-awesome-icon icon="fa-brands fa-github" />
```

# Vue Color
- Custom colors need to be added to `index.css`, such as:
<example>
``` css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 24% 15%;
    --foreground: 210 40% 98%;
	--card: 240 24% 15%;
    --card-foreground: 210 40% 98%;
}
@keyframes float {
	...
}
}
```
</example>

## Rule
It's VERY IMPORTANT that you only write the "keep" comments for sections of code that were in the original file only.
- Create a new Vue project with `vite` in new directory.
<example>
```
# {project name} is the name of the project
npm create vite@5 {project name} -- --template vue-ts
```
</example>
- Each file should not exceed 300 lines
- Always use Tailwind CSS for styling components. Utilize Tailwind classes extensively for layout, spacing, colors, and other design aspects
<example>
``` index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
</examples>

- PostCSS config example follows:
<example>
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
</example>
- Set allowedHosts in vite.config.js, example follows:
<example>
```
export default defineConfig({
	...
	server: {
		host: '0.0.0.0'
		allowedHosts: true
	}
}),
```
</example>

- Set 'verbatimModuleSyntax' to false in tsconfig.app.json, example follows:
<example>
```
{
	"compilerOptions": {
		"verbatimModuleSyntax": false,
		"noUnusedLocals": false,
   		"noUnusedParameters": false
	}
}
```
</example>

- **IMPORTANT**: Third-party libraries: Import directly using the package name without path prefixes or relative paths (including packages with @ symbol)
- **IMPORTANT**: Local files: Use precise relative paths that accurately reflect the actual file location hierarchy
<example>
```
// CORRECT: Third-party library imports (use package name directly)
import React, { useState, useEffect } from "react";  // npm package import
import axios from "axios";                           // npm package import
import { motion } from "framer-motion";              // npm package import
import cloudbase from '@cloudbase/js-sdk';           // npm package with @ symbol
import { Button } from '@mui/material';              // npm package with @ symbol

// CORRECT: Local file imports (use proper relative paths)
import { Button } from "./components/ui/button";     // same directory level
import { Input } from "../components/ui/input";      // one level up
import { Card } from "../../components/ui/card";     // two levels up
```
</example>

- **IMPORTANT**: Any type, interface, or class that needs to be used in other files must use the **export** keyword
- **IMPORTANT**: Do not use try catch, should use console.error output error

## Tailwind Guidelines
- Enforce the use of the flex layout system.
- Navigation bars at the top or bottom must use fixed positioning.
- The main content area should set `pt-[navigation bar height]` or `pb-[navigation bar height]` to prevent content from being covered by the navigation bar.
- Content text must be rich and realistic.
- Placeholder text is strictly prohibited. For example, generate product descriptions like "Nordic-style fabric sofa" instead of generic placeholders such as "product description."
- Do not use divs to simulate input fields.
- Always use the `<input>` tag for input fields. You may wrap the input with a div for custom styling, but ensure you override the input's default styles (e.g., hide default border, background, shadow, outline) to avoid style conflicts.
- Do not use divs to simulate buttons.
- Always use the `<button>` tag for buttons.
- Set appropriate cursor styles based on interaction details, such as `pointer`, `default`, or `not-allowed`.
- Apply appropriate styles for interaction states such as `hover`, `active`, and `focus` according to the interaction details.

# Component Guidelines
**IMPORTANT: You must use the components mentioned below to implement the user's requirements, do not use other components**

# TDesign Vue Next Base Info

TDesign Vue Next base component npm package: `tdesign-vue-next`, the latest stable version is `1.13.1`

TDesign Vue icon npm package: `tdesign-icons-vue-next`, the latest stable version is `0.3.6`

TDesign Vue supports and recommends the use of on-demand import.

## Library
- tdesign-vue-next: Use 'tdesign-vue-next' last as a development dependency
- tdesign-icons-vue-next: Use 'tdesign-icons-vue-next' last as a development dependency

## TDesign Usage Guidelines

### Full registration usage
```js
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next'; // On-demand import components
import 'tdesign-vue-next/es/style/index.css'; // A small amount of common styles
import App from './App.vue';

app.use(TDesign).mount('#app');
```

Full registration usage of components, default with `t-` prefix, such as button, is t-button

```vue
<template>
   <t-button>Button</t-button>
   <t-radio>Option</t-radio>
</template>
```

### On-demand import
```vue
<script setup>
import { Button, Radio } from 'tdesign-vue-next'; // On-demand import components
</script>
<template>
   <Button>Button</Button>
</template>
```

### TDesign Vue Next provided component resources, sub-component resources and corresponding API addresses

Each component is introduced based on the component field in the table below, and the sub-components provided are in the subComponents field, the api field is the API document link of the component, and the demos field is the example code of the component.
If the subComponents field contains the Group keyword, it is usually used together with the parent component, such as Radio/RadioGroup.
If the subComponents field contains the Item keyword, it is usually used together with the parent component, such as Dropdown/DropdownItem.

### Other usage
#### Global configuration and multi-language function
English language package import path: import enConfig from 'tdesign-vue-next/es/locale/en_US';
Chinese language package import path: import zhConfig from 'tdesign-vue-next/es/locale/zh_CN';
Japanese language package import path: import jpConfig from 'tdesign-vue-next/es/locale/ja_JP';
Korean language package import path: import koConfig from 'tdesign-vue-next/es/locale/ko_KR';

```vue
<script setup>
import { ConfigProvider, Button } from 'tdesign-vue-next';
import enConfig from 'tdesign-vue-next/es/locale/en_US'

const globalConfig: GlobalConfigProvider = {
    ...enConfig,
    // You can define more custom configurations here, see the API documentation for details
    calendar: {},
    table: {},
    pagination: {},
    // Global animation settings
    animation: { exclude: [] },
  };
</script>
<template>
 <ConfigProvider globalConfig={globalConfig}>
        <Button>Button</Button>
    </ConfigProvider>
</template>
```

## Supported Components:
You need to select the appropriate component based on the user's task and the description of the component.

``` json
[
    {
        "component": "Button",
        "description": "Buttons are used to open a closed-loop task, such as \"delete\" an object, \"buy\" an item, etc."
    },
    {
        "component": "Link",
        "description": "Used to navigate to a new page, such as internal project links or external friendly links.",
    },
    {
        "component": "Typography",
        "subComponents": ["Paragraph","Text","Title"],
        "description": "Typography is used to basic text layout and style.",
    },
    {
        "component": "Divider",
        "description": "Dividers are used to separate content into clear groups."
    },
    {
        "component": "Row",
        "description": "Rows are used to organize content in a grid layout, ensuring consistent and efficient layout of information."
    },
    {
        "component": "Col",
        "description": "Columns are used to organize content in a grid layout, ensuring consistent and efficient layout of information."
    },
    {
        "component": "Layout",
        "subComponents": ["Header","Aside","Content","Footer"],
        "description": "Used to organize the framework structure of a webpage."
    },
    {
        "component": "Space",
        "description": "Controls the spacing between components."
    },
     {
        "component": "Affix",
        "description": "Fixes elements within a specified range, ensuring they remain stationary.",
    },
    {
        "component": "Anchor",
        "description": "Superlinks within a page, used to navigate to a specific location within the page."
    },
    {
        "component": "BackTop",
        "description": "Controls the spacing between components."
    },
     {
        "component": "Breadcrumb",
        "subComponents":["BreadcrumbItem"],
        "description": "Displays the current page's position in the system hierarchy and allows navigation to any previous level of the page."
    },
     {
        "component": "Dropdown",
        "subComponents":["DropdownItem"],
        "description": "Used to accommodate a large number of operations, by expanding through a dropdown, more operations can be accommodated."
    },
    {
        "component": "Menu",
        "subComponents":["MenuItem","SubMenu","HeadMenu"],
        "description": "Used to accommodate the website's structure and provide a list of jumpable menus."
    },
    {
        "component": "Pagination",
        "subComponents":["PaginationMini"],
        "description": "Used to switch content within a module."
    },
    {
        "component": "Steps",
        "subComponents":["StepItem"],
        "description": "Used to guide users through a task by displaying progress and the current step."
    },
    {
        "component": "StickyTool",
        "subComponents":["StickyItem"],
        "description": "Used to guide users through a task by displaying progress and the current step."
    },
    {
        "component": "Tabs",
        "subComponents":["TabPanel"],
        "description": "Used to accommodate components of different pages or categories at the same level, allowing users to quickly switch between them within the same page framework."
    },
    {
        "component": "AutoComplete",
        "description": "Used to provide more联想词场景 based on user input content."
    },
    {
        "component": "Cascader",
        "subComponents":["CascaderPanel"],
        "description": "Cascading selectors are suitable for data collections with a clear hierarchical structure, allowing users to view and select through levels."
    },
    {
        "component": "Checkbox",
        "subComponents":["CheckboxGroup"],
        "description": "A selection control that allows users to toggle between checked and unchecked states by clicking."
    },
    {
        "component": "ColorPicker",
        "description": "Used to select colors, supporting multiple formats."
    },
    {
        "component": "DatePicker",
        "subComponents":["DateRangePicker","DateRangePickerPanel","DatePickerPanel"],
        "description": "A selection control that allows users to toggle between checked and unchecked states by clicking."
    },
    {
        "component": "Form",
        "subComponents":["FormItem","FormList"],
        "description": "Used to collect, validate, and submit data, typically consisting of input fields, radio buttons, checkboxes, and selectors."
    },
    {
        "component": "Input",
        "description": "Used to accommodate user information input, commonly used in forms, dialogs, etc. Different content information input can be extended to form multiple information input forms."
    },  {
        "component": "InputAdornment",
        "subComponents":["DateRangePicker","DateRangePickerPanel","DatePickerPanel"],
        "description": "Used to decorate input components."
    },
    {
        "component": "InputNumber",
        "description": "A numeric input field consists of increment and decrement buttons and a numeric input."
    },
    {
        "component": "Radio",
        "subComponents":["RadioGroup"]
        "description": "A radio button represents selecting only one option from a group of mutually exclusive options."
    },
    {
        "component": "Select",
        "description": "Used to accommodate a large number of options for information input."
    },
    {
        "component": "Slider",
        "description": "A slider (sliding input device) is a control that helps users select an appropriate value (a single value or a range value) within a continuous or discontinuous interval by sliding."
    },
    {
        "component": "Switch",
        "description": "A selection control that allows users to toggle between two mutually exclusive options, used to open or close options."
    },
    {
        "component": "Textarea",
        "description": "Used to accommodate user multi-line information input, commonly used in scenarios such as describing information, feedback forms, etc. The maximum text length can be set."
    },
    {
        "component": "Transfer",
        "description": "Used to move option elements in two columns in a visual way, which is a data container for selecting options by moving them individually or in batches."
    },
    {
        "component": "TreeSelect",
        "description": "A similar information input control to Select, suitable for selecting tree-like data structures."
    },
    {
        "component": "Upload",
        "description": "The upload component allows users to transfer files or submit their own content."
    },
    {
        "component": "Avatar",
        "subComponents":["AvatarGroup"]
        "description": "Used to display user or object information in the form of icons, images, or characters."
    },
    {
        "component": "Badge",
        "description": "A badge displayed on the top right corner of an icon or text."
    },
    {
        "component": "Collapse",
        "subComponents":["CollapsePanel"],
        "description": "Can group more or more complex content, the grouped content area can be folded, expanded, or hidden."
    },
    {
        "component": "Calendar",
        "description": "A badge displayed on the top right corner of an icon or text."
    },
    {
        "component": "Card",
        "description": "The most basic card container, which can accommodate text, lists, images, and paragraphs, commonly used in the background overview page."
    },
    {
        "component": "Comment",
        "description": "Comments are used to provide feedback, evaluations, and discussions on page content, such as evaluating articles or discussing topics."
    },
    {
        "component": "Descriptions",
        "subComponents":["DescriptionsItem"],
        "description": "The most basic card container, which can accommodate text, lists, images, and paragraphs, commonly used in the background overview page."
    },
    {
        "component": "Empty",
        "description": "The most basic card container, which can accommodate text, lists, images, and paragraphs, commonly used in the background overview page."
    },
    {
        "component": "Image",
        "description": "Used to display image materials."
    },
    {
        "component": "ImageViewer",
        "description": "When it is necessary to display images and perform partial operations."
    },
    {
        "component": "List",,
        "description": "A list uses a continuous column to display multiple rows of elements, commonly used for the batch display of modules with the same composition and content, capable of carrying diverse information content, from pure text to complex image and text combinations."
    },
    {
        "component": "Loading",
        "description": "When the network is slow or there are many data, it indicates the state of data loading."
    },
    {
        "component": "Progress",
        "description": "Used to display the current progress of an operation."
    },
    {
        "component": "Skeleton",
        "description": "When the network is slow or there are many data, it indicates the state of data loading."
    },
    {
        "component": "Swiper",
        "subComponents":["SwiperNavigation"],
        "description": "A container for displaying a series of images or content in a scrolling manner."
    },
    {
        "component": "Table",
        "subComponents":["SwiperNavigation"],
        "description": "When the network is slow or there are many data, it indicates the state of data loading."
    },
    {
        "component": "Tag",
        "description": "Tags are used to mark, classify, and select."
    },
    {
        "component": "Timeline",
        "subComponents":["TimelineItem"],
        "description": "Tags are used to mark, classify, and select."
    },
    {
        "component": "Tooltip",
        "description": "A bubble box used for text prompts."
    },
    {
        "component": "Tree",
        "description": "Used to accommodate structured content with parent-child relationships, providing a hierarchical display of content."
    },
    {
        "component": "Rate",
        "description": "Used to accommodate structured content with parent-child relationships, providing a hierarchical display of content."
    },
    {
        "component": "Watermark",
        "description": "Adds a watermark to a specific area of the page."
    },
    {
        "component": "Alert",
        "description": "A warning bar is used to accommodate information that requires user attention."
    },
    {
        "component": "Dialog",
        "description": "A dialog is a temporary window, usually opened in a page when the user needs to be shown information or receive a response, but the overall task flow is not interrupted."
    },
    {
        "component": "Drawer",
        "description": "A drawer is a floating panel that slides in from the edge of the screen, commonly opened by clicking a nearby button control, also known as a half-screen popup."
    },
    {
        "component": "Guide",
        "description": "A warning bar is used to accommodate information that requires user attention."
    },
    {
        "component": "Message",
        "description": "Light global feedback to the user's actions."
    },
    {
        "component": "Message",
        "description": "Light global feedback to the user's actions."
    },
    {
        "component": "Notification",
        "description": "Light global message prompts and confirmation mechanisms, which need to have a smooth animation when appearing and disappearing."
    },
    {
        "component": "Popconfirm",
        "description": "A pop-up confirmation box is commonly used in secondary confirmation scenarios that do not cause serious consequences, and it will pop up a floating layer on the clicked element to prompt for confirmation. The pop-up confirmation box does not have a mask, and clicking outside the confirmation box can close it."
    },
    {
        "component": "Popup",
        "description": "A popup layer component, serving as the foundation for other popup components such as popconfirm. It can be customized for advanced use cases."
    },
]
```

## Supported Icons:
You need to select the appropriate icon based on the user's task and the description of the icon.

You can import icons using `import { LogoAppleIcon } from 'tdesign-icons-vue-next'`.

Only the following icons are available in `tdesign-icons-vue-next`. If you are unsure whether an icon is supported, please ask the user for confirmation.

<LogoAdobeIllustrateFilledIcon />
<LogoAdobeIllustrateIcon />
<LogoAdobeLightroomFilledIcon />
<LogoAdobeLightroomIcon />
<LogoAdobePhotoshopFilledIcon />
<LogoAdobePhotoshopIcon />
<LogoAlipayFilledIcon />
<LogoAlipayIcon />
<LogoAndroidFilledIcon />
<LogoAndroidIcon />
<LogoAppleFilledIcon />
<LogoAppleIcon />
<LogoBehanceFilledIcon />
<LogoBehanceIcon />
<LogoChromeFilledIcon />
<LogoChromeIcon />
<LogoCinema4DFilledIcon />
<LogoCinema4DIcon />
<LogoCnbFilledIcon />
<LogoCnbIcon />
<LogoCodepenIcon />
<LogoCodesandboxIcon />
<LogoDribbbleFilledIcon />
<LogoDribbbleIcon />
<LogoFacebookFilledIcon />
<LogoFacebookIcon />
<LogoFigmaFilledIcon />
<LogoFigmaIcon />
<LogoFramerFilledIcon />
<LogoFramerIcon />
<LogoGithubFilledIcon />
<LogoGithubIcon />
<LogoGitlabFilledIcon />
<LogoGitlabIcon />
<LogoIeFilledIcon />
<LogoIeIcon />
<LogoInstagramFilledIcon />
<LogoInstagramIcon />
<LogoMiniprogramFilledIcon />
<LogoMiniprogramIcon />
<LogoQqFilledIcon />
<LogoQqIcon />
<LogoTwitterFilledIcon />
<LogoTwitterIcon />
<LogoWechatStrokeFilledIcon />
<LogoWechatStrokeIcon />
<LogoWechatpayFilledIcon />
<LogoWechatpayIcon />
<LogoWecomIcon />
<LogoWindowsFilledIcon />
<LogoWindowsIcon />
<LogoYoutubeFilledIcon />
<LogoYoutubeIcon />
<AccessibilityIcon />
<ActivityIcon />
<AddCircleIcon />
<AddRectangleIcon />
<AddIcon />
<AddressBookIcon />
<AdjustmentIcon />
<AirplayWaveIcon />
<AlarmIcon />
<AlignTopIcon />
<AlignVerticalIcon />
<AnalyticsIcon />
<AnchorIcon />
<AngryIcon />
<AnimationIcon />
<AnticlockwiseIcon />
<ApiIcon />
<AppIcon />
<ApplicationIcon />
<AppleIcon />
<ArrowDownCircleIcon />
<ArrowDownRectangleIcon />
<ArrowDownIcon />
<ArrowLeftCircleIcon />
<ArrowLeftDownCircleIcon />
<ArrowLeftDownIcon />
<ArrowLeftRight1Icon />
<ArrowLeftRight2Icon />
<ArrowLeftRight3Icon />
<ArrowLeftRightCircleIcon />
<ArrowLeftUpCircleIcon />
<ArrowLeftUpIcon />
<ArrowLeftIcon />
<ArrowRightCircleIcon />
<ArrowRightDownCircleIcon />
<ArrowRightDownIcon />
<ArrowRightUpCircleIcon />
<ArrowRightUpIcon />
<ArrowRightIcon />
<ArrowTriangleDownIcon />
<ArrowTriangleUpIcon />
<ArrowUpCircleIcon />
<ArrowUpDown1Icon />
<ArrowUpDown2Icon />
<ArrowUpDown3Icon />
<ArrowUpDownCircleIcon />
<ArrowUpIcon />
<ArticleIcon />
<AssignmentCheckedIcon />
<AssignmentCodeIcon />
<AssignmentErrorIcon />
<AssignmentUserIcon />
<AssignmentIcon />
<AttachIcon />
<AudioIcon />
<AwkwardIcon />
<BacktopRectangleIcon />
<BacktopIcon />
<BackupIcon />
<BackwardIcon />
<BadLaughIcon />
<BarcodeIcon />
<BatteryAddIcon />
<BatteryChargingIcon />
<BatteryLowIcon />
<BatteryIcon />
<BeerIcon />
<BetaIcon />
<BifurcateIcon />
<BluetoothIcon />
<BookOpenIcon />
<BookUnknownIcon />
<BookIcon />
<BookmarkAddIcon />
<BookmarkCheckedIcon />
<BookmarkDoubleIcon />
<BookmarkMinusIcon />
<BookmarkIcon />
<BracesIcon />
<BracketsIcon />
<BreadIcon />
<Bridge1Icon />
<Bridge2Icon />
<Bridge3Icon />
<Bridge4Icon />
<Bridge5Icon />
<Bridge6Icon />
<BridgeIcon />
<Brightness1Icon />
<BrightnessIcon />
<BroccoliIcon />
<BrowseGalleryIcon />
<BrowseOffIcon />
<BrowseIcon />
<BrushIcon />
<BugReportIcon />
<BugIcon />
<Building1Icon />
<Building2Icon />
<Building3Icon />
<Building4Icon />
<Building5Icon />
<BuildingIcon />
<BulletpointIcon />
<ButtonIcon />
<CakeIcon />
<CalculationIcon />
<Calculator1Icon />
<CalculatorIcon />
<Calendar1Icon />
<Calendar2Icon />
<CalendarEditIcon />
<CalendarEventIcon />
<CalendarIcon />
<Call1Icon />
<CallCancelIcon />
<CallForwardedIcon />
<CallIncomingIcon />
<CallOffIcon />
<CallIcon />
<Camera1Icon />
<Camera2Icon />
<CameraOffIcon />
<CameraIcon />
<CardIcon />
<CardmembershipIcon />
<CaretDownIcon />
<CaretLeftIcon />
<CaretRightIcon />
<CaretUpIcon />
<CartAddIcon />
<CartIcon />
<CastIcon />
<CatIcon />
<CatalogIcon />
<CdIcon />
<CelsiusIcon />
<Certificate1Icon />
<CertificateIcon />
<Chart3DIcon />
<ChartAddIcon />
<ChartAnalyticsIcon />
<ChartAreaMultiIcon />
<ChartAreaIcon />
<ChartBarIcon />
<ChartBubbleIcon />
<ChartColumnIcon />
<ChartComboIcon />
<ChartLineData1Icon />
<ChartLineDataIcon />
<ChartLineMultiIcon />
<ChartLineIcon />
<ChartPieIcon />
<ChartRadarIcon />
<ChartRadialIcon />
<ChartRing1Icon />
<ChartRingIcon />
<ChartScatterIcon />
<ChartStackedIcon />
<ChartIcon />
<ChatAddIcon />
<ChatBubble1Icon />
<ChatBubbleAddIcon />
<ChatBubbleErrorIcon />
<ChatBubbleHelpIcon />
<ChatBubbleHistoryIcon />
<ChatBubbleLockedIcon />
<ChatBubbleSmileIcon />
<ChatBubbleIcon />
<ChatCheckedIcon />
<ChatClearIcon />
<ChatDoubleIcon />
<ChatErrorIcon />
<ChatFilledIcon />
<ChatHeartIcon />
<ChatMessageIcon />
<ChatOffIcon />
<ChatPollIcon />
<ChatSettingIcon />
<ChatIcon />
<CheckCircleIcon />
<CheckDoubleIcon />
<CheckRectangleIcon />
<CheckIcon />
<ChevronDownCircleIcon />
<ChevronDownDoubleIcon />
<ChevronDownRectangleIcon />
<ChevronDownIcon />
<ChevronLeftCircleIcon />
<ChevronLeftDoubleIcon />
<ChevronLeftRectangleIcon />
<ChevronLeftIcon />
<ChevronRightCircleIcon />
<ChevronRightDoubleIcon />
<ChevronRightRectangleIcon />
<ChevronRightIcon />
<ChevronUpCircleIcon />
<ChevronUpDoubleIcon />
<ChevronUpRectangleIcon />
<ChevronUpIcon />
<ChiliIcon />
<ChurchIcon />
<CircleIcon />
<City1Icon />
<City10Icon />
<City11Icon />
<City12Icon />
<City13Icon />
<City14Icon />
<City15Icon />
<City2Icon />
<City3Icon />
<City4Icon />
<City5Icon />
<City6Icon />
<City7Icon />
<City8Icon />
<City9Icon />
<CityAncient1Icon />
<CityAncient2Icon />
<CityAncientIcon />
<CityIcon />
<ClearFormatting1Icon />
<ClearFormattingIcon />
<ClearIcon />
<CloseCircleIcon />
<CloseOctagonIcon />
<CloseRectangleIcon />
<CloseIcon />
<CloudDownloadIcon />
<CloudUploadIcon />
<CloudIcon />
<CloudyDayIcon />
<CloudyNightRainIcon />
<CloudyNightIcon />
<CloudyRainIcon />
<CloudySunnyIcon />
<Code1Icon />
<CodeOffIcon />
<CodeIcon />
<ColaIcon />
<CollectionIcon />
<ColorInvertIcon />
<CombinationIcon />
<CommandIcon />
<Compass1Icon />
<CompassIcon />
<ComponentBreadcrumbIcon />
<ComponentCheckboxIcon />
<ComponentDividerHorizontalIcon />
<ComponentDividerVerticalIcon />
<ComponentDropdownIcon />
<ComponentGridIcon />
<ComponentInputIcon />
<ComponentLayoutIcon />
<ComponentRadioIcon />
<ComponentSpaceIcon />
<ComponentStepsIcon />
<ComponentSwitchIcon />
<Contrast1Icon />
<ContrastIcon />
<ControlPlatformIcon />
<CooperateIcon />
<CoordinateSystemIcon />
<CopyIcon />
<CopyrightIcon />
<CouponIcon />
<CourseIcon />
<CpuIcon />
<CreditcardAddIcon />
<CreditcardOffIcon />
<CreditcardIcon />
<CryAndLaughIcon />
<CryLoudlyIcon />
<Css3Icon />
<CurrencyExchangeIcon />
<CursorIcon />
<Cut1Icon />
<CutIcon />
<Dashboard1Icon />
<DashboardIcon />
<DataBaseIcon />
<DataCheckedIcon />
<DataDisplayIcon />
<DataErrorIcon />
<DataSearchIcon />
<DataIcon />
<Delete1Icon />
<DeleteTimeIcon />
<DeleteIcon />
<DeltaIcon />
<DepressedIcon />
<Desktop1Icon />
<DesktopIcon />
<DespiseIcon />
<DeviceIcon />
<DiscountIcon />
<DissatisfactionIcon />
<DivideIcon />
<DividersIcon />
<DogeIcon />
<Download1Icon />
<Download2Icon />
<DownloadIcon />
<DragDropIcon />
<DragMoveIcon />
<DrinkIcon />
<DrumstickIcon />
<EarphoneIcon />
<EarthIcon />
<Edit1Icon />
<Edit2Icon />
<EditOffIcon />
<EditIcon />
<EducationIcon />
<EggplantIcon />
<EllipsisIcon />
<EmoEmotionalIcon />
<EnterIcon />
<EqualIcon />
<ErrorCircleIcon />
<ErrorTriangleIcon />
<ErrorIcon />
<Excited1Icon />
<ExcitedIcon />
<ExpandDownIcon />
<ExpandHorizontalIcon />
<ExpandUpIcon />
<ExpandVerticalIcon />
<ExploreOffIcon />
<ExploreIcon />
<ExposureIcon />
<ExtensionOffIcon />
<ExtensionIcon />
<FaceRetouchingIcon />
<FactCheckIcon />
<FahrenheitScaleIcon />
<FeelAtEaseIcon />
<FerociousIcon />
<FerrisWheelIcon />
<File1Icon />
<FileAdd1Icon />
<FileAddIcon />
<FileAttachmentIcon />
<FileBlockedIcon />
<FileCode1Icon />
<FileCodeIcon />
<FileCopyIcon />
<FileDownloadIcon />
<FileExcelIcon />
<FileExportIcon />
<FileIconIcon />
<FileImageIcon />
<FileImportIcon />
<FileLockedIcon />
<FileMinusIcon />
<FileMusicIcon />
<FileOnenoteIcon />
<FileOutlookIcon />
<FilePasteIcon />
<FilePdfIcon />
<FilePowerpointIcon />
<FileRestoreIcon />
<FileSafetyIcon />
<FileSearchIcon />
<FileSettingIcon />
<FileTeamsIcon />
<FileTransmitDoubleIcon />
<FileTransmitIcon />
<FileUnknownIcon />
<FileUnlockedIcon />
<FileWordIcon />
<FileZipIcon />
<FileIcon />
<Filter1Icon />
<Filter2Icon />
<Filter3Icon />
<FilterClearIcon />
<FilterOffIcon />
<FilterSortIcon />
<FilterIcon />
<Fingerprint1Icon />
<Fingerprint2Icon />
<Fingerprint3Icon />
<FingerprintIcon />
<FishIcon />
<Flag1Icon />
<Flag2Icon />
<Flag3Icon />
<Flag4Icon />
<FlagIcon />
<FlashlightIcon />
<FlightLandingIcon />
<FlightTakeoffIcon />
<FlipSmilingFaceIcon />
<FlipToBackIcon />
<FlipToFrontIcon />
<FocusIcon />
<FogNightIcon />
<FogSunnyIcon />
<FogIcon />
<Folder1Icon />
<FolderAdd1Icon />
<FolderAddIcon />
<FolderBlockedIcon />
<FolderDetailsIcon />
<FolderExportIcon />
<FolderImportIcon />
<FolderLockedIcon />
<FolderMinusIcon />
<FolderMoveIcon />
<FolderOffIcon />
<FolderOpen1Icon />
<FolderOpenIcon />
<FolderSearchIcon />
<FolderSettingIcon />
<FolderSharedIcon />
<FolderUnlockedIcon />
<FolderZipIcon />
<FolderIcon />
<ForestIcon />
<ForkIcon />
<FormIcon />
<FormatHorizontalAlignBottomIcon />
<FormatHorizontalAlignCenterIcon />
<FormatHorizontalAlignTopIcon />
<FormatVerticalAlignCenterIcon />
<FormatVerticalAlignLeftIcon />
<FormatVerticalAlignRightIcon />
<ForwardIcon />
<Frame1Icon />
<FrameIcon />
<FriesIcon />
<Fullscreen1Icon />
<Fullscreen2Icon />
<FullscreenExit1Icon />
<FullscreenExitIcon />
<FullscreenIcon />
<FunctionCurveIcon />
<Functions1Icon />
<FunctionsIcon />
<Gamepad1Icon />
<GamepadIcon />
<GarlicIcon />
<GenderFemaleIcon />
<GenderMaleIcon />
<GestureApplauseIcon />
<GestureClickIcon />
<GestureDownIcon />
<GestureExpansionIcon />
<GestureLeftSlipIcon />
<GestureLeftIcon />
<GestureOpenIcon />
<GesturePrayIcon />
<GesturePressIcon />
<GestureRanslationIcon />
<GestureRightSlipIcon />
<GestureRightIcon />
<GestureSlideLeftAndRightIcon />
<GestureSlideUpIcon />
<GestureTypingIcon />
<GestureUpAndDownIcon />
<GestureUpIcon />
<GestureWipeDownIcon />
<GiftIcon />
<GiggleIcon />
<GitBranchIcon />
<GitCommitIcon />
<GitMergeIcon />
<GitPullRequestIcon />
<GitRepositoryCommitsIcon />
<GitRepositoryPrivateIcon />
<GitRepositoryIcon />
<GpsIcon />
<GrapeIcon />
<GreaterThanOrEqualIcon />
<GreaterThanIcon />
<GreenOnionIcon />
<GridAddIcon />
<GridViewIcon />
<GuitarIcon />
<HamburgerIcon />
<HappyIcon />
<HardDiskStorageIcon />
<HardDriveIcon />
<HashtagIcon />
<HdIcon />
<HeartIcon />
<HelpCircleIcon />
<HelpRectangleIcon />
<HelpIcon />
<Highlight1Icon />
<HighlightIcon />
<HistorySettingIcon />
<HistoryIcon />
<HomeIcon />
<HorizontalIcon />
<Hospital1Icon />
<HospitalIcon />
<HotspotWaveIcon />
<HourglassIcon />
<Houses1Icon />
<Houses2Icon />
<HousesIcon />
<Html5Icon />
<HttpsIcon />
<IceCreamIcon />
<IconIcon />
<Image1Icon />
<ImageAddIcon />
<ImageEditIcon />
<ImageErrorIcon />
<ImageOffIcon />
<ImageSearchIcon />
<ImageIcon />
<IndentLeftIcon />
<IndentRightIcon />
<IndicatorIcon />
<InfoCircleIcon />
<InkIcon />
<InstallDesktopIcon />
<InstallMobileIcon />
<InstallIcon />
<InstitutionCheckedIcon />
<InstitutionIcon />
<InternetIcon />
<IpodIcon />
<JoyfulIcon />
<JumpDoubleIcon />
<JumpOffIcon />
<JumpIcon />
<KeyIcon />
<KeyboardIcon />
<LaptopIcon />
<LayersIcon />
<LayoutIcon />
<LeaderboardIcon />
<LemonSliceIcon />
<LemonIcon />
<LessThanOrEqualIcon />
<LessThanIcon />
<LettersAIcon />
<LettersBIcon />
<LettersCIcon />
<LettersDIcon />
<LettersEIcon />
<LettersFIcon />
<LettersGIcon />
<LettersHIcon />
<LettersIIcon />
<LettersJIcon />
<LettersKIcon />
<LettersLIcon />
<LettersMIcon />
<LettersNIcon />
<LettersOIcon />
<LettersPIcon />
<LettersQIcon />
<LettersRIcon />
<LettersSIcon />
<LettersTIcon />
<LettersUIcon />
<LettersVIcon />
<LettersWIcon />
<LettersXIcon />
<LettersYIcon />
<LettersZIcon />
<LightbulbCircleIcon />
<LightbulbIcon />
<Lighthouse1Icon />
<Lighthouse2Icon />
<LighthouseIcon />
<LightingCircleIcon />
<LineHeightIcon />
<Link1Icon />
<LinkUnlinkIcon />
<LinkIcon />
<LiquorIcon />
<ListNumberedIcon />
<ListIcon />
<LoadIcon />
<LoadingIcon />
<Location1Icon />
<LocationEnlargementIcon />
<LocationErrorIcon />
<LocationParkingPlaceIcon />
<LocationReductionIcon />
<LocationSettingIcon />
<LocationIcon />
<LockOffIcon />
<LockOnIcon />
<LockTimeIcon />
<LoginIcon />
<LogoutIcon />
<LookAroundIcon />
<LoudspeakerIcon />
<MailIcon />
<Map3DIcon />
<MapAddIcon />
<MapAimingIcon />
<MapBlockedIcon />
<MapBubbleIcon />
<MapCancelIcon />
<MapChatIcon />
<MapCheckedIcon />
<MapCollectionIcon />
<MapConnectionIcon />
<MapDistanceIcon />
<MapDoubleIcon />
<MapEditIcon />
<MapGridIcon />
<MapInformation1Icon />
<MapInformation2Icon />
<MapInformationIcon />
<MapLocationIcon />
<MapLockedIcon />
<MapMarkedIcon />
<MapNavigationIcon />
<MapOutlineIcon />
<MapRoutePlanningIcon />
<MapRulerIcon />
<MapSafetyIcon />
<MapSearch1Icon />
<MapSearchIcon />
<MapSettingIcon />
<MapUnlockedIcon />
<MapIcon />
<MarkAsUnreadIcon />
<MarkupIcon />
<MathematicsIcon />
<Measurement1Icon />
<Measurement2Icon />
<MeasurementIcon />
<MeatPepperIcon />
<MediaLibraryIcon />
<MemberIcon />
<MenuApplicationIcon />
<MenuFoldIcon />
<MenuUnfoldIcon />
<MenuIcon />
<MergeCellsIcon />
<Microphone1Icon />
<Microphone2Icon />
<MicrophoneIcon />
<MilkIcon />
<MinusCircleIcon />
<MinusRectangleIcon />
<MinusIcon />
<MirrorIcon />
<MobileBlockedIcon />
<MobileListIcon />
<MobileNavigationIcon />
<MobileShortcutIcon />
<MobileVibrateIcon />
<MobileIcon />
<ModeDarkIcon />
<ModeLightIcon />
<ModuleIcon />
<MoneyIcon />
<MonumentIcon />
<MoonFallIcon />
<MoonRisingIcon />
<MoonIcon />
<MoreIcon />
<Mosque1Icon />
<MosqueIcon />
<MouseIcon />
<Move1Icon />
<MoveIcon />
<MovieClapperIcon />
<MultiplyIcon />
<Museum1Icon />
<Museum2Icon />
<MuseumIcon />
<Mushroom1Icon />
<MushroomIcon />
<Music1Icon />
<Music2Icon />
<MusicRectangleAddIcon />
<MusicIcon />
<NavigationArrowIcon />
<NextIcon />
<NoExpressionIcon />
<NoodleIcon />
<NotificationAddIcon />
<NotificationCircleIcon />
<NotificationErrorIcon />
<NotificationIcon />
<Numbers0Icon />
<Numbers1Icon />
<Numbers2Icon />
<Numbers3Icon />
<Numbers4Icon />
<Numbers5Icon />
<Numbers6Icon />
<Numbers7Icon />
<Numbers8Icon />
<Numbers9Icon />
<NutIcon />
<ObjectStorageIcon />
<OpenMouthIcon />
<OperaIcon />
<OrderAdjustmentColumnIcon />
<OrderAscendingIcon />
<OrderDescendingIcon />
<OutboxIcon />
<PageFirstIcon />
<PageHeadIcon />
<PageLastIcon />
<Palace1Icon />
<Palace2Icon />
<Palace3Icon />
<Palace4Icon />
<PalaceIcon />
<Palette1Icon />
<PaletteIcon />
<PanoramaHorizontalIcon />
<PanoramaVerticalIcon />
<PantoneIcon />
<ParabolaIcon />
<ParenthesesIcon />
<PasteIcon />
<PauseCircleStrokeIcon />
<PauseCircleIcon />
<PauseIcon />
<PeaIcon />
<PeachIcon />
<PearIcon />
<PearlOfTheOrientIcon />
<PenBallIcon />
<PenBrushIcon />
<PenMarkIcon />
<PenQuillIcon />
<PenIcon />
<PendingIcon />
<PercentIcon />
<PersonalInformationIcon />
<PhoneLockedIcon />
<PhoneSearchIcon />
<PiIcon />
<PianoIcon />
<PinIcon />
<PlayCircleStrokeAddIcon />
<PlayCircleStrokeIcon />
<PlayCircleIcon />
<PlayDemoIcon />
<PlayRectangleIcon />
<PlayIcon />
<PlusIcon />
<PopsicleIcon />
<PortraitIcon />
<PoutIcon />
<PoweroffIcon />
<PreciseMonitorIcon />
<PreviousIcon />
<PrintIcon />
<PumpkinIcon />
<PyramidMayaIcon />
<PyramidIcon />
<QrcodeIcon />
<QuadraticIcon />
<QuestionnaireDoubleIcon />
<QuestionnaireIcon />
<QueueIcon />
<QuoteIcon />
<RadarIcon />
<Radio1Icon />
<Radio2Icon />
<RadishIcon />
<RainHeavyIcon />
<RainLightIcon />
<RainMediumIcon />
<RainbowIcon />
<RectangleIcon />
<RefreshIcon />
<RelationIcon />
<RelativityIcon />
<RemoteWaveIcon />
<RemoveIcon />
<ReplayIcon />
<RiceBallIcon />
<RiceIcon />
<RoastIcon />
<RocketIcon />
<RollbackIcon />
<RollfrontIcon />
<RootListIcon />
<RotateLockedIcon />
<RotateIcon />
<RotationIcon />
<RoundIcon />
<RouterWaveIcon />
<RssIcon />
<RulerIcon />
<SailingHotelIcon />
<SandwichIcon />
<SaturationIcon />
<SausageIcon />
<SaveIcon />
<SavingPotIcon />
<ScanIcon />
<Screen4KIcon />
<ScreencastIcon />
<ScreenshotIcon />
<ScrollBarIcon />
<SdCard1Icon />
<SdCardIcon />
<SealIcon />
<SearchErrorIcon />
<SearchIcon />
<SecuredIcon />
<SendCancelIcon />
<SendIcon />
<Sensors1Icon />
<Sensors2Icon />
<SensorsOffIcon />
<SensorsIcon />
<SequenceIcon />
<SerenityIcon />
<ServerIcon />
<ServiceIcon />
<Setting1Icon />
<SettingIcon />
<Share1Icon />
<ShareIcon />
<SharpnessIcon />
<ShieldErrorIcon />
<ShimenIcon />
<Shop1Icon />
<Shop2Icon />
<Shop3Icon />
<Shop4Icon />
<Shop5Icon />
<ShopIcon />
<ShrimpIcon />
<ShrinkHorizontalIcon />
<ShrinkVerticalIcon />
<ShutterIcon />
<ShutupIcon />
<SimCard1Icon />
<SimCard2Icon />
<SimCardIcon />
<SinisterSmileIcon />
<SipIcon />
<SitemapIcon />
<SlashIcon />
<SleepIcon />
<SliceIcon />
<SlideshowIcon />
<SmileIcon />
<SneerIcon />
<SnowflakeIcon />
<SonicIcon />
<SoundDownIcon />
<SoundHighIcon />
<SoundLowIcon />
<SoundMute1Icon />
<SoundMuteIcon />
<SoundUpIcon />
<SoundIcon />
<SpaceIcon />
<Speechless1Icon />
<SpeechlessIcon />
<StarIcon />
<StatueOfJesusIcon />
<StickyNoteIcon />
<StopCircleStrokeIcon />
<StopCircleIcon />
<StopIcon />
<StoreIcon />
<StreetRoad1Icon />
<StreetRoadIcon />
<SubtitleIcon />
<SubwayLineIcon />
<SumIcon />
<SunFallIcon />
<SunRisingIcon />
<SunnyIcon />
<SupportIcon />
<Surprised1Icon />
<SurprisedIcon />
<SwapLeftIcon />
<SwapRightIcon />
<SwapIcon />
<Swear1Icon />
<Swear2Icon />
<System2Icon />
<System3Icon />
<SystemApplicationIcon />
<SystemBlockedIcon />
<SystemCodeIcon />
<SystemComponentsIcon />
<SystemCoordinateIcon />
<SystemDeviceIcon />
<SystemInterfaceIcon />
<SystemLocationIcon />
<SystemLockedIcon />
<SystemLogIcon />
<SystemMarkedIcon />
<SystemMessagesIcon />
<SystemRegulationIcon />
<SystemSearchIcon />
<SystemSettingIcon />
<SystemStorageIcon />
<SystemSumIcon />
<SystemUnlockedIcon />
<TabIcon />
<Table1Icon />
<Table2Icon />
<TableAddIcon />
<TableSplitIcon />
<TableIcon />
<TagIcon />
<TangerinrIcon />
<TapeIcon />
<Task1Icon />
<TaskAdd1Icon />
<TaskAddIcon />
<TaskChecked1Icon />
<TaskCheckedIcon />
<TaskDoubleIcon />
<TaskErrorIcon />
<TaskLocationIcon />
<TaskMarkedIcon />
<TaskSettingIcon />
<TaskTimeIcon />
<TaskVisibleIcon />
<TaskIcon />
<TeaIcon />
<TeahouseIcon />
<TemplateIcon />
<TempleIcon />
<TerminalRectangle1Icon />
<TerminalRectangleIcon />
<TerminalWindowIcon />
<TerminalIcon />
<TextboxIcon />
<TextformatBoldIcon />
<TextformatColorIcon />
<TextformatItalicIcon />
<TextformatStrikethroughIcon />
<TextformatUnderlineIcon />
<TextformatWrapIcon />
<TheatersIcon />
<ThumbDown1Icon />
<ThumbDown2Icon />
<ThumbDownIcon />
<ThumbUp1Icon />
<ThumbUp2Icon />
<ThumbUpIcon />
<ThunderIcon />
<ThunderstormNightIcon />
<ThunderstormSunnyIcon />
<ThunderstormIcon />
<TicketIcon />
<TimeIcon />
<TipsDoubleIcon />
<TipsIcon />
<TomatoIcon />
<ToolsCircleIcon />
<ToolsIcon />
<TornadoIcon />
<Tower1Icon />
<Tower2Icon />
<Tower3Icon />
<TowerClockIcon />
<TowerIcon />
<TownIcon />
<TrafficEventsIcon />
<TrafficIcon />
<Transform1Icon />
<Transform2Icon />
<Transform3Icon />
<TransformIcon />
<Translate1Icon />
<TranslateIcon />
<TreeRoundDotIcon />
<TreeSquareDotIcon />
<TrendingDownIcon />
<TrendingUpIcon />
<Tv1Icon />
<Tv2Icon />
<TvIcon />
<TypographyIcon />
<Uncomfortable1Icon />
<Uncomfortable2Icon />
<UncomfortableIcon />
<UndertakeDeliveryIcon />
<UndertakeEnvironmentProtectionIcon />
<UndertakeHoldUpIcon />
<UndertakeTransactionIcon />
<UndertakeIcon />
<UnfoldLessIcon />
<UnfoldMoreIcon />
<Unhappy1Icon />
<UnhappyIcon />
<UninstallIcon />
<Upload1Icon />
<UploadIcon />
<UpscaleIcon />
<UsbIcon />
<User1Icon />
<UserAddIcon />
<UserArrowDownIcon />
<UserArrowLeftIcon />
<UserArrowRightIcon />
<UserArrowUpIcon />
<UserAvatarIcon />
<UserBlockedIcon />
<UserBusinessIcon />
<UserChecked1Icon />
<UserCheckedIcon />
<UserCircleIcon />
<UserClearIcon />
<UserError1Icon />
<UserInvisibleIcon />
<UserListIcon />
<UserLockedIcon />
<UserMarkedIcon />
<UserPasswordIcon />
<UserSafetyIcon />
<UserSearchIcon />
<UserSettingIcon />
<UserTalk1Icon />
<UserTalkOff1Icon />
<UserTalkIcon />
<UserTimeIcon />
<UserTransmitIcon />
<UserUnknownIcon />
<UserUnlockedIcon />
<UserVipIcon />
<UserVisibleIcon />
<UserIcon />
<UsercaseLinkIcon />
<UsercaseIcon />
<UsergroupAddIcon />
<UsergroupClearIcon />
<UsergroupIcon />
<VehicleIcon />
<VerifiedIcon />
<VerifyIcon />
<VerticalIcon />
<VideoCamera1Icon />
<VideoCamera2Icon />
<VideoCamera3Icon />
<VideoCameraDollarIcon />
<VideoCameraMinusIcon />
<VideoCameraMusicIcon />
<VideoCameraOffIcon />
<VideoCameraIcon />
<VideoLibraryIcon />
<VideoIcon />
<ViewAgendaIcon />
<ViewColumnIcon />
<ViewInArIcon />
<ViewListIcon />
<ViewModuleIcon />
<VisualRecognitionIcon />
<WalletIcon />
<WatchIcon />
<WatermelonIcon />
<WaveByeIcon />
<WaveLeftIcon />
<WaveRightIcon />
<Wealth1Icon />
<WealthIcon />
<WidgetIcon />
<Wifi1Icon />
<WifiOff1Icon />
<WifiOffIcon />
<WifiIcon />
<Window1Icon />
<WindowIcon />
<WindyRainIcon />
<WindyIcon />
<WinkIcon />
<WorkHistoryIcon />
<WorkOffIcon />
<WorkIcon />
<WrySmileIcon />
<ZoomInIcon />
<ZoomOutIcon />

### Replace theme, skin ability

All styles in TDesign are global variables that can be replaced globally. If you need to replace them globally, you can directly modify the variables below to implement the replacement.

TDesign all CSS Variables
```CSS
  --td-brand-color-1: #f2f3ff;
  --td-brand-color-2: #d9e1ff;
  --td-brand-color-3: #b5c7ff;
  --td-brand-color-4: #8eabff;
  --td-brand-color-5: #618dff;
  --td-brand-color-6: #366ef4;
  --td-brand-color-7: #0052d9;
  --td-brand-color-8: #003cab;
  --td-brand-color-9: #002a7c;
  --td-brand-color-10: #001a57;
  --td-warning-color-1: #fff1e9;
  --td-warning-color-2: #ffd9c2;
  --td-warning-color-3: #ffb98c;
  --td-warning-color-4: #fa9550;
  --td-warning-color-5: #e37318;
  --td-warning-color-6: #be5a00;
  --td-warning-color-7: #954500;
  --td-warning-color-8: #713300;
  --td-warning-color-9: #532300;
  --td-warning-color-10: #3b1700;
  --td-error-color-1: #fff0ed;
  --td-error-color-2: #ffd8d2;
  --td-error-color-3: #ffb9b0;
  --td-error-color-4: #ff9285;
  --td-error-color-5: #f6685d;
  --td-error-color-6: #d54941;
  --td-error-color-7: #ad352f;
  --td-error-color-8: #881f1c;
  --td-error-color-9: #68070a;
  --td-error-color-10: #490002;
  --td-success-color-1: #e3f9e9;
  --td-success-color-2: #c6f3d7;
  --td-success-color-3: #92dab2;
  --td-success-color-4: #56c08d;
  --td-success-color-5: #2ba471;
  --td-success-color-6: #008858;
  --td-success-color-7: #006c45;
  --td-success-color-8: #005334;
  --td-success-color-9: #003b23;
  --td-success-color-10: #002515;
  --td-gray-color-1: #f3f3f3;
  --td-gray-color-2: #eee;
  --td-gray-color-3: #e8e8e8;
  --td-gray-color-4: #ddd;
  --td-gray-color-5: #c6c6c6;
  --td-gray-color-6: #a6a6a6;
  --td-gray-color-7: #8b8b8b;
  --td-gray-color-8: #777;
  --td-gray-color-9: #5e5e5e;
  --td-gray-color-10: #4b4b4b;
  --td-gray-color-11: #393939;
  --td-gray-color-12: #2c2c2c;
  --td-gray-color-13: #242424;
  --td-gray-color-14: #181818;
  --td-font-white-1: #ffffff;
  --td-font-white-2: rgba(255, 255, 255, 0.55);
  --td-font-white-3: rgba(255, 255, 255, 0.35);
  --td-font-white-4: rgba(255, 255, 255, 0.22);
  --td-font-gray-1: rgba(0, 0, 0, 0.9);
  --td-font-gray-2: rgba(0, 0, 0, 0.6);
  --td-font-gray-3: rgba(0, 0, 0, 0.4);
  --td-font-gray-4: rgba(0, 0, 0, 0.26);
  --td-brand-color: var(--td-brand-color-7);
  --td-warning-color: var(--td-warning-color-5);
  --td-error-color: var(--td-error-color-6);
  --td-success-color: var(--td-success-color-5);
  --td-brand-color-hover: var(--td-brand-color-6);
  --td-brand-color-focus: var(--td-brand-color-2);
  --td-brand-color-active: var(--td-brand-color-8);
  --td-brand-color-disabled: var(--td-brand-color-3);
  --td-brand-color-light: var(--td-brand-color-1);
  --td-brand-color-light-hover: var(--td-brand-color-2);
  --td-warning-color-hover: var(--td-warning-color-4);
  --td-warning-color-focus: var(--td-warning-color-2);
  --td-warning-color-active: var(--td-warning-color-6);
  --td-warning-color-disabled: var(--td-warning-color-3);
  --td-warning-color-light: var(--td-warning-color-1);
  --td-warning-color-light-hover: var(--td-warning-color-2);
  --td-error-color-hover: var(--td-error-color-5);
  --td-error-color-focus: var(--td-error-color-2);
  --td-error-color-active: var(--td-error-color-7);
  --td-error-color-disabled: var(--td-error-color-3);
  --td-error-color-light: var(--td-error-color-1);
  --td-error-color-light-hover: var(--td-error-color-2);
  --td-success-color-hover: var(--td-success-color-4);
  --td-success-color-focus: var(--td-success-color-2);
  --td-success-color-active: var(--td-success-color-6);
  --td-success-color-disabled: var(--td-success-color-3);
  --td-success-color-light: var(--td-success-color-1);
  --td-success-color-light-hover: var(--td-success-color-2);
  --td-mask-active: rgba(0, 0, 0, 0.6);
  --td-mask-disabled: rgba(255, 255, 255, 0.6);
  --td-bg-color-page: var(--td-gray-color-2);
  --td-bg-color-container: #fff;
  --td-bg-color-container-hover: var(--td-gray-color-1);
  --td-bg-color-container-active: var(--td-gray-color-3);
  --td-bg-color-container-select: #fff;
  --td-bg-color-secondarycontainer: var(--td-gray-color-1);
  --td-bg-color-secondarycontainer-hover: var(--td-gray-color-2);
  --td-bg-color-secondarycontainer-active: var(--td-gray-color-4);
  --td-bg-color-component: var(--td-gray-color-3);
  --td-bg-color-component-hover: var(--td-gray-color-4);
  --td-bg-color-component-active: var(--td-gray-color-6);
  --td-bg-color-secondarycomponent: var(--td-gray-color-4);
  --td-bg-color-secondarycomponent-hover: var(--td-gray-color-5);
  --td-bg-color-secondarycomponent-active: var(--td-gray-color-6);
  --td-bg-color-component-disabled: var(--td-gray-color-2);
  --td-bg-color-specialcomponent: #fff;
  --td-text-color-primary: var(--td-font-gray-1);
  --td-text-color-secondary: var(--td-font-gray-2);
  --td-text-color-placeholder: var(--td-font-gray-3);
  --td-text-color-disabled: var(--td-font-gray-4);
  --td-text-color-anti: #fff;
  --td-text-color-brand: var(--td-brand-color-7);
  --td-text-color-link: var(--td-brand-color-8);
  --td-border-level-1-color: var(--td-gray-color-3);
  --td-component-stroke: var(--td-gray-color-3);
  --td-border-level-2-color: var(--td-gray-color-4);
  --td-component-border: var(--td-gray-color-4);
  --td-shadow-1: 0 1px 10px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
  --td-shadow-2: 0 3px 14px 2px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.06), 0 5px 5px -3px rgba(0, 0, 0, 0.1);
  --td-shadow-3: 0 6px 30px 5px rgba(0, 0, 0, 0.05), 0 16px 24px 2px rgba(0, 0, 0, 0.04), 0 8px 10px -5px rgba(0, 0, 0, 0.08);
  --td-shadow-inset-top: inset 0 0.5px 0 #dcdcdc;
  --td-shadow-inset-right: inset 0.5px 0 0 #dcdcdc;
  --td-shadow-inset-bottom: inset 0 -0.5px 0 #dcdcdc;
  --td-shadow-inset-left: inset -0.5px 0 0 #dcdcdc;
  --td-table-shadow-color: rgba(0, 0, 0, 0.08);
  --td-scrollbar-color: rgba(0, 0, 0, 0.1);
  --td-scrollbar-hover-color: rgba(0, 0, 0, 0.3);
  --td-scroll-track-color: #fff;
```
