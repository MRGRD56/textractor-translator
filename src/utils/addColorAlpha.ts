const addColorAlpha = (color: string, opacity: number) => {
    const roundedOpacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + roundedOpacity.toString(16).toUpperCase().padStart(2, '0');
};

export default addColorAlpha;