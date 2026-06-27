export const defaultLocale = "zh";

export const locales = {
	zh: {
		label: "中文",
		lang: "zh-CN",
		path: "/",
	},
	en: {
		label: "English",
		lang: "en",
		path: "/en/",
	},
} as const;

export type Locale = keyof typeof locales;

const rawBasePath = import.meta.env.BASE_URL ?? "/";
export const basePath = rawBasePath.endsWith("/") ? rawBasePath.slice(0, -1) : rawBasePath;

function isExternalPath(path: string): boolean {
	return /^(https?:)?\/\//.test(path) || /^(mailto|tel):/.test(path) || path.startsWith("#");
}

export function stripBasePath(path: string): string {
	if (!basePath) return path;
	if (path === basePath) return "/";
	if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length) || "/";
	return path;
}

export function withBase(path: string): string {
	if (!path || isExternalPath(path) || !path.startsWith("/")) return path;

	const normalized = stripBasePath(path);
	if (!basePath) return normalized;
	if (normalized === "/") return `${basePath}/`;
	return `${basePath}${normalized}`;
}

const shared = {
	name: "Ena",
	email: "2949224434@qq.com",
	emailIcon: "@",
	avatar: "/avatar.png",
	visitorCount: "0001",
	background: {
		image: "",
		blur: "0px",
		opacity: 0,
		scale: 1,
		overlay: "radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 30%), linear-gradient(180deg, #050505 0%, #000 55%, #090909 100%)",
		rain: {
			enabled: false,
			mode: "falling",
			density: 0.7,
			speed: 1,
			dropColor: "rgba(210, 230, 255, 0.5)",
			rippleColor: "rgba(210, 230, 255, 0.34)",
			maxDrops: 170,
			maxRipples: 48,
		},
	},
	socials: [
		{ label: "GitHub", href: "https://github.com/sswewe111", icon: "GH" },
		// { label: "B站", href: "https://space.bilibili.com/285705387", icon: "B" },
		// { label: "Folo", href: "https://folo.is", icon: "F" },
	],
};

const siteConfigs = {
	zh: {
		...shared,
		title: "学生 / 二次元 / AI 学习 / CV学习",
		description: "基于 Atlas 项目搭建的个人博客，用来沉淀博客笔记、项目经历与简历内容，也记录持续学习和实践的过程。",
		nav: [
			{ label: "首页", href: "/" },
			// { label: "关于我", href: "/about" },
			{ label: "博客", href: "/blog" },
			{ label: "项目", href: "/projects" },
			// { label: "图谱", href: "/graph" },
			// { label: "简历", href: "/resume" },
			// { label: "联系", href: "/contact" },
		],
		quickLinks: [
			{ label: "博客", href: "/blog", icon: "书" },
			{ label: "项目", href: "/projects", icon: "作" },
			// { label: "关于", href: "/about", icon: "我" },
			// { label: "简历", href: "/resume", icon: "历" },
			{ label: "联系", href: "https://github.com/sswewe111", icon: "@" },
		],
		today: {
			title: "电波频道",
			quotes: [
				"Malkuth：“昂首阔步的信念”",
				"Yesod：“卓尔不凡的理性”",
				"Hod：“愈加善良的希望”",
				"Netzach：“生存下去的勇气”",
				"Tiphereth：“存在意义的憧憬”",
				"Chesed：“值得托付的信任”",
				"Geburah：“守护他人的决意”",
				"Hokma：“拥抱过去，创造未来”",
				"Binah：“直面恐惧，斩断循环”",
			],
			timeLabel: "当前时间",
			timeZone: "Asia/Shanghai",
			dateLocale: "zh-CN",
			greetings: ["凌晨好", "早上好", "上午好", "中午好", "下午好", "晚上好"],
		},
		ui: {
			headerCta: "打个招呼",
			projectCta: "查看项目 ->",
			projectLiveCta: "访问项目",
			projectRepoCta: "查看代码",
			backToList: "返回列表",
			socialCardCta: "查看主页",
		},
		home: {
			eyebrowNote: "一个喜欢二次元的学生的博客，用于记录在AI和CV学习过程中的点滴。",
			visitorText: "访客编号 #{count}，欢迎翻翻这个小角落",
			headline: "把上课、折腾和突然冒出的想法都放在这里。",
			intro: "欢迎来到我的博客，这里记录我学习经历、项目作品和一些个人兴趣的内容。",
			primaryCta: { label: "看看项目", href: "/projects" },
			blogCta: { label: "查看博客", href: "/blog" },
			secondaryCta: { label: "打个招呼", href: "https://github.com/sswewe111" },
		},
		pages: {
			home: {
				title: "首页",
				description: "一个黑色系 Astro 个人网站模板。",
				modules: [
					{ type: "homeHero" },
					{
						type: "blogPreview",
						props: {
							kicker: "Notes",
							title: "最新笔记",
							limit: 3,
						},
					},
					{
						type: "projectGrid",
						props: {
							kicker: "Small Builds",
							title: "项目实现",
							featuredOnly: true,
							limit: 0,
							columns: 3,
						},
					},
				],
			},
			about: {
				title: "关于我",
				description: "关于学生个人主页、学习方向、技能和兴趣的介绍。",
				modules: [
					{
						type: "aboutIntro",
						props: {
							kicker: "About",
							heading: "我在课程、代码和兴趣项目之间慢慢探索。",
							intro: "这个模板适合介绍一个正在学习设计、前端、内容创作或任何个人兴趣方向的学生。",
							profileLabel: "Profile",
							profile: "喜欢把学到的东西做成页面、小工具和可以回头看的笔记。",
							paragraphs: [
								"我关心的不只是页面长什么样，也包括内容怎么组织、学习过程怎么留下来、项目以后还能不能继续改。",
								"这里可以写你的专业、兴趣、最近在学的技术、社团经历，或者只是放一些关于自己的碎碎念。",
							],
						},
					},
					{
						type: "gameList",
						props: {
							title: "主页可以放什么",
							description: "这些模块都可以在 src/config/site.ts 里替换成自己的栏目。",
							items: [
								{ label: "学习记录", description: "记录课程、阅读、实验和阶段性复盘。" },
								{ label: "项目作品", description: "展示课程作业、开源项目和个人练手。" },
								{ label: "博客笔记", description: "用 Markdown 把想法留下来，支持标签和双链。" },
								{ label: "简历经历", description: "教育背景、技能、项目经验和可下载的 PDF 简历。" },
							],
						},
					},
					{
						type: "skillCloud",
						props: {
							title: "技能栈",
							skills: ["Astro", "TypeScript", "Tailwind CSS", "Design Systems", "UX Engineering", "Content Strategy"],
						},
					},
					{ type: "contactPanel" },
				],
			},
			projects: {
				title: "项目经历",
				// description: "课程作业、小项目、作品集和实验记录。",
				modules: [],
			},
			blog: {
				title: "博客 / 笔记",
				// description: "关于课程、前端、设计、生活和长期学习的笔记。",
				modules: [
					{
						type: "blogIndex",
						props: {
							kicker: "Notes",
							title: "博客 / 笔记",
							// description: "用 Markdown 记录学习过程、项目复盘、课堂笔记和日常观察。草稿文章会在列表中自动过滤。",
							labels: {
								search: "搜索标题、摘要或标签",
								all: "全部",
								empty: "没有找到符合条件的笔记。",
							},
							pageSize: 8,
						},
					},
				],
			},
			graph: {
				title: "知识图谱",
				description: "由博客标签和双链生成的知识图谱。",
				modules: [
					{
						type: "knowledgeGraph",
						props: {
							kicker: "Graph",
							title: "知识图谱",
							description: "每篇笔记都是一个节点，在这里可以看见整个知识库的结构。",
						},
					},
				],
			},
			resume: {
				title: "简历 / 经历",
				description: "学生经历、技能、项目和学习记录。",
				profileLabel: "Profile",
				emailLabel: "Email",
				linksLabel: "Links",
				skillsLabel: "Skills",
				highlightsLabel: "Highlights",
				modules: [
					{
						type: "resume",
						props: {
							kicker: "Resume",
							title: "简历 / 经历",
							description: "此页面展示教育经历、项目经验、技能和可下载的简历文件。",
						},
					},
				],
			},
			contact: {
				title: "联系方式",
				description: "联系这个个人网站的作者。",
				modules: [
					{
						type: "contactCards",
						props: {
							kicker: "Contact",
							heading: "关于项目、写作或个人网站的想法，欢迎来信。",
							intro: "把你的 Email、GitHub、Bilibili、Folo、Telegram 或其他公开链接放在这里。",
						},
					},
					{ type: "contactPanel" },
				],
			},
		},
		contactPanel: {
			kicker: "Message",
			heading: "如果你在这里发现了有趣的项目或笔记，欢迎打个招呼。",
		},
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Design Systems", "UX Engineering", "Content Strategy"],
		resume: {
			summary: "一个模板简历区域，用于展示教育、技能、项目亮点和可下载的简历文件。",
			details: [
				{ label: "Location", value: "Campus / Online" },
				{ label: "Focus", value: "Design Engineering / Frontend / Content" },
			],
			links: [
				{ label: "Projects", href: "/projects" },
				{ label: "Notes", href: "/blog" },
				{ label: "Contact", href: "/contact" },
			],
			files: [],
			highlights: ["Add awards, competitions, or course highlights here", "Add open-source contributions or club experience here"],
			sections: [
				{
					title: "Experience",
					items: [
						{
							period: "2025 - Now",
							title: "Student Builder",
							org: "Campus and spare time",
							description: "Turning coursework, personal interests, and frontend practice into maintainable projects and notes.",
							points: ["Learning", "Projects", "Notes"],
							link: [],
						},
						{
							period: "2024 - 2025",
							title: "Frontend Learner",
							org: "Self-directed projects",
							description: "Practicing Astro, TypeScript, Tailwind CSS, and content-driven websites by building real pages.",
							points: ["Astro", "TypeScript", "Tailwind CSS"],
							link: [],
						},
					],
				},
			],
		},
	},
	en: {
		...shared,
		title: "Student / Anime / AI Learning / CV Learning",
		description: "A personal blog built on Atlas for collecting blog notes, project experience, and resume details while documenting ongoing learning and practice.",
		nav: [
			{ label: "Home", href: "/" },
			// { label: "About", href: "/about" },
			{ label: "Blog", href: "/blog" },
			{ label: "Projects", href: "/projects" },
			// { label: "Graph", href: "/graph" },
			// { label: "Resume", href: "/resume" },
			// { label: "Contact", href: "/contact" },
		],
		quickLinks: [
			{ label: "Blog", href: "/blog", icon: "N" },
			{ label: "Projects", href: "/projects", icon: "P" },
			// { label: "About", href: "/about", icon: "A" },
			// { label: "Resume", href: "/resume", icon: "R" },
			{ label: "Contact", href: "https://github.com/sswewe111", icon: "@" },
		],
		today: {
			title: "Radio Channel",
			quotes: [
				"Malkuth: \"The faith to stride forward\"",
				"Yesod: \"Reason that stands apart\"",
				"Hod: \"Hope that grows ever kinder\"",
				"Netzach: \"The courage to keep living\"",
				"Tiphereth: \"A longing for the meaning of existence\"",
				"Chesed: \"Trust worthy of being entrusted\"",
				"Geburah: \"The resolve to protect others\"",
				"Hokma: \"Embrace the past, create the future\"",
				"Binah: \"Face fear and sever the cycle\"",
			],
			timeLabel: "My current time",
			timeZone: "Asia/Shanghai",
			dateLocale: "en-US",
			greetings: ["Good late night", "Good early morning", "Good morning", "Good noon", "Good afternoon", "Good evening"],
		},
		ui: {
			headerCta: "Say hi",
			projectCta: "View project ->",
			projectLiveCta: "Visit project",
			projectRepoCta: "View code",
			backToList: "Back to list",
			socialCardCta: "View profile",
		},
		home: {
			eyebrowNote: "A blog by an anime-loving student, recording fragments from learning AI and CV.",
			visitorText: "Visitor #{count}, welcome to this small corner",
			headline: "Putting classes, experiments, and sudden ideas in one place.",
			intro: "Welcome to my blog, where I record my learning journey, project work, and a few personal interests.",
			primaryCta: { label: "View projects", href: "/projects" },
			blogCta: { label: "View blog", href: "/blog" },
			secondaryCta: { label: "Say hi", href: "https://github.com/sswewe111" },
		},
		pages: {
			home: {
				title: "Home",
				description: "A dark-themed Astro personal website template.",
				modules: [
					{ type: "homeHero" },
					{
						type: "blogPreview",
						props: {
							kicker: "Notes",
							title: "Latest notes",
							limit: 3,
						},
					},
					{
						type: "projectGrid",
						props: {
							kicker: "Small Builds",
							title: "Project Implementation",
							featuredOnly: true,
							limit: 0,
							columns: 3,
						},
					},
				],
			},
			about: {
				title: "About",
				description: "About this student homepage, learning direction, skills, and interests.",
				modules: [
					{
						type: "aboutIntro",
						props: {
							kicker: "About",
							heading: "I am slowly exploring across courses, code, and interest projects.",
							intro: "This page is for introducing a student who is learning design, frontend, content creation, or any personal interest direction.",
							profileLabel: "Profile",
							profile: "I enjoy turning what I learn into pages, small tools, and notes I can revisit later.",
							paragraphs: [
								"I care not only about how a page looks, but also how content is organized, how the learning process is preserved, and whether a project can keep evolving later.",
								"This is where I can write about my major, interests, recent technologies I am learning, club experience, or just scattered thoughts about myself.",
							],
						},
					},
					{
						type: "gameList",
						props: {
							title: "What can be placed on the homepage",
							description: "These modules can all be replaced with my own sections in src/config/site.ts.",
							items: [
								{ label: "Study Records", description: "Record courses, reading, experiments, and periodic reviews." },
								{ label: "Project Work", description: "Show coursework, open-source projects, and personal practice." },
								{ label: "Blog Notes", description: "Keep ideas in Markdown, with support for tags and wiki links." },
								{ label: "Resume Experience", description: "Education background, skills, project experience, and downloadable PDF resume." },
							],
						},
					},
					{
						type: "skillCloud",
						props: {
							title: "Skills",
							skills: ["Astro", "TypeScript", "Tailwind CSS", "Design Systems", "UX Engineering", "Content Strategy"],
						},
					},
					{ type: "contactPanel" },
				],
			},
			projects: {
				title: "Project Experience",
				// description: "Coursework, small projects, portfolio pieces, and experiment records.",
				modules: [],
			},
			blog: {
				title: "Blog / Notes",
				// description: "Notes about coursework, frontend, design, life, and long-term learning.",
				modules: [
					{
						type: "blogIndex",
						props: {
							kicker: "Notes",
							title: "Blog / Notes",
							// description: "Write learning logs, project reviews, class notes, and daily observations in Markdown. Drafts are hidden from lists automatically.",
							labels: {
								search: "Search title, summary, or tags",
								all: "All",
								empty: "No notes match the current filters.",
							},
							pageSize: 6,
						},
					},
				],
			},
			graph: {
				title: "Knowledge Graph",
				description: "A knowledge graph generated from wiki links in blog posts.",
				modules: [
					{
						type: "knowledgeGraph",
						props: {
							kicker: "Graph",
							title: "Knowledge Graph",
							description: "Each note is a node. Wiki links create connections between notes.",
						},
					},
				],
			},
			resume: {
				title: "Resume / Experience",
				description: "Student experience, skills, projects, and learning records.",
				profileLabel: "Profile",
				emailLabel: "Email",
				linksLabel: "Links",
				skillsLabel: "Skills",
				highlightsLabel: "Highlights",
				modules: [
					{
						type: "resume",
						props: {
							kicker: "Resume",
							title: "Resume / Experience",
							description: "This page shows education, project experience, skills, and downloadable resume files.",
						},
					},
				],
			},
			contact: {
				title: "Contact",
				description: "Contact the author of this personal website.",
				modules: [
					{
						type: "contactCards",
						props: {
							kicker: "Contact",
							heading: "Send a note about projects, writing, or personal websites.",
							intro: "Add your email, GitHub, Bilibili, Folo, Telegram, or any public contact link here.",
						},
					},
					{ type: "contactPanel" },
				],
			},
		},
		contactPanel: {
			kicker: "Message",
			heading: "If you find an interesting project or note here, feel free to say hi.",
		},
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Design Systems", "UX Engineering", "Content Strategy"],
		resume: {
			summary: "A template resume area for education, skills, project highlights, and downloadable resume files.",
			details: [
				{ label: "Location", value: "Campus / Online" },
				{ label: "Focus", value: "Design Engineering / Frontend / Content" },
			],
			links: [
				{ label: "Projects", href: "/projects" },
				{ label: "Notes", href: "/blog" },
				{ label: "Contact", href: "/contact" },
			],
			files: [],
			highlights: ["Add awards, competitions, or course highlights here", "Add open-source contributions or club experience here"],
			sections: [
				{
					title: "Experience",
					items: [
						{
							period: "2025 - Now",
							title: "Student Builder",
							org: "Campus and spare time",
							description: "Turning coursework, personal interests, and frontend practice into maintainable projects and notes.",
							points: ["Learning", "Projects", "Notes"],
							link: [],
						},
						{
							period: "2024 - 2025",
							title: "Frontend Learner",
							org: "Self-directed projects",
							description: "Practicing Astro, TypeScript, Tailwind CSS, and content-driven websites by building real pages.",
							points: ["Astro", "TypeScript", "Tailwind CSS"],
							link: [],
						},
					],
				},
			],
		},
	},
} as const;

export function isLocale(locale: string | undefined): locale is Locale {
	return locale === "zh" || locale === "en";
}

export function getLocaleFromUrl(url: URL): Locale {
	const firstSegment = stripBasePath(url.pathname).split("/").filter(Boolean)[0];
	return isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export function localizePath(locale: Locale, path: string): string {
	if (isExternalPath(path)) return path;

	const normalized = stripBasePath(path);
	if (locale === defaultLocale) return withBase(normalized);
	if (normalized === "/") return withBase(`/${locale}/`);
	if (normalized.startsWith(`/${locale}/`)) return withBase(normalized);
	return withBase(`/${locale}${normalized.startsWith("/") ? normalized : `/${normalized}`}`);
}

function localizeModuleLinks(module: { type: string; props?: Record<string, unknown> }, locale: Locale) {
	if (module.type === "gameList" || module.type === "linkGrid") {
		const props = module.props as { items?: Array<string | { href?: string }> } | undefined;
		return {
			...module,
			props: {
				...module.props,
				items: props?.items?.map((item) => (
					typeof item === "string" ? item : { ...item, href: item.href ? localizePath(locale, item.href) : item.href }
				)),
			},
		};
	}

	return module;
}

function localizeSiteLinks<T extends typeof siteConfigs[Locale]>(config: T, locale: Locale): T {
	return {
		...config,
		avatar: withBase(config.avatar),
		background: {
			...config.background,
			image: withBase(config.background.image),
		},
		nav: config.nav.map((item) => ({ ...item, href: localizePath(locale, item.href) })),
		quickLinks: config.quickLinks.map((item) => ({ ...item, href: localizePath(locale, item.href) })),
		home: {
			...config.home,
			primaryCta: { ...config.home.primaryCta, href: localizePath(locale, config.home.primaryCta.href) },
			blogCta: { ...config.home.blogCta, href: localizePath(locale, config.home.blogCta.href) },
			secondaryCta: { ...config.home.secondaryCta, href: localizePath(locale, config.home.secondaryCta.href) },
		},
		pages: {
			...config.pages,
			...Object.fromEntries(
				Object.entries(config.pages).map(([key, page]) => [
					key,
					"modules" in page
						? { ...page, modules: page.modules.map((module) => localizeModuleLinks(module, locale)) }
						: page,
				]),
			),
		},
		resume: {
			...config.resume,
			links: config.resume.links.map((item) => ({ ...item, href: localizePath(locale, item.href) })),
		},
	} as T;
}

export function getSiteConfig(localeOrUrl: Locale | URL = defaultLocale) {
	const locale = localeOrUrl instanceof URL ? getLocaleFromUrl(localeOrUrl) : localeOrUrl;
	return localizeSiteLinks(siteConfigs[locale], locale);
}

export const siteConfig = getSiteConfig(defaultLocale);
