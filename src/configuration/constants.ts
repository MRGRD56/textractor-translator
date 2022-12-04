export const defaultTransformerSource = `
app.languages = {
    source: 'ja',
    target: 'en'
};

app.translator = 'GOOGLE_TRANSLATE';

app.transformOriginal = ({text, meta}) => {
    return text;
};`.trim();