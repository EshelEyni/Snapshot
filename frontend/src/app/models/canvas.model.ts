import { IconDefinition } from "@fortawesome/free-regular-svg-icons";

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
        width: number;
    };
    type: string;
    isDragging: boolean;

}

export interface CanvasStroke {
    color: string;
    shadowBlur: number;
    size: number;
    pos: Position[];
    type: string;
    strokeType: string;
}

export interface CanvasSticker {
    url: string;
    rect: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
    type: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface StrokeType {
    icon: IconDefinition;
    type: string;
    isSelected: boolean;
}
export interface FontType {
    value: string;
    isSelected: boolean;
}

export interface CanvasSticker { }