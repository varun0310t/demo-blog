import TextStyle from '@tiptap/extension-text-style';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            /**
             * Set the font size
             */
            setFontSize: (size: string) => ReturnType;
            /**
             * Unset the font size
             */
            unsetFontSize: () => ReturnType;
        };
    }
}

export const TextStyleExtended = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: (element) => element.style.fontSize.replace('px', '') || null,
                renderHTML: (attributes) => {
                    if (!attributes['fontSize']) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes['fontSize']}px`
                    };
                }
            }
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setFontSize:
                (fontSize: string) =>
                ({ commands }) => {
                    return commands.setMark(this.name, { fontSize: fontSize });
                },
            unsetFontSize:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name); // Correctly remove the fontSize mark
                }
        };
    }
});