export interface AllScreenProperties {
    /** The screen's width in pixels */
    pixelWidth: number | null;

    /** The screen's height in pixels */
    pixelHeight: number | null;

    /** 
     * The total number of pixels in the display
     * (product of pixelWidth and pixelHeight)
     */
    pixelCount: number | null;

    /** The number of pixels per physical unit of width or height */
    pixelDensity: number | null;

    /** The ratio of width to height */
    ratio: number | null;

    /** The physical width of the screen */
    physicalWidth: number | null;

    /** The physical height of the screen */
    physicalHeight: number | null;

    /** The physical area of the screen in square units */
    area: number | null;

    /** The diagonal size of the screen */
    diagonalSize: number | null;
}

/**
 * Defines the properties available to a screen
 */
export type ScreenProperties = {
    [p in keyof AllScreenProperties]?: ScreenProperties[p];
}
