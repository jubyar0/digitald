export interface Language {
    code: string;
    name: string;
    flag: string;
    direction?: 'ltr' | 'rtl';
}

export const I18N_LANGUAGES: Language[] = [
    {
        code: 'en',
        name: 'English',
        flag: '/media/flags/united-states.svg',
        direction: 'ltr',
    },
    {
        code: 'ar',
        name: 'Arabic',
        flag: '/media/flags/saudi-arabia.svg',
        direction: 'rtl',
    },
    {
        code: 'es',
        name: 'Spanish',
        flag: '/media/flags/spain.svg',
        direction: 'ltr',
    },
    {
        code: 'de',
        name: 'German',
        flag: '/media/flags/germany.svg',
        direction: 'ltr',
    },
    {
        code: 'ch',
        name: 'Chinese',
        flag: '/media/flags/china.svg',
        direction: 'ltr',
    },
];

export const DEFAULT_LANGUAGE = I18N_LANGUAGES[0];
