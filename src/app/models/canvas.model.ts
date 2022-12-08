export interface CanvasTxt {
    str: string;
    style: {
        color: string;
        'font-size': string;
        'font-family': string;
    };
    rect: {
        x: number;
        y: number;
        height: number;
        width: number ;
    };
    type: string;
    isDragging: boolean;

}
