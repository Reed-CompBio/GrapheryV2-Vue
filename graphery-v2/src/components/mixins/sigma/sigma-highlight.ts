import type { NodeDisplayData, PartialButFor } from 'sigma/types';
import type { Settings } from 'sigma/settings';
import { DEFAULT_SETTINGS } from 'sigma/settings';
import drawHover from 'sigma/rendering/canvas/hover';
import drawLabel from 'sigma/rendering/canvas/label';

export interface SpecialHighlightNodeDisplayData extends NodeDisplayData {
    highlightColor?: Set<string>; // TODO: maybe consider Set?
    accessed?: string;
}

export interface SpecialHighlightSettings
    extends Omit<Settings, 'hoverRenderer'> {
    defaultAccessColor: string;
    highlightWidth: number;
    highlightTransparency: number;
    hoverRenderer: typeof drawHighlight | typeof drawHover;
}

export const SPECIAL_HIGHLIGHT_DEFAULT_SETTINGS: SpecialHighlightSettings = {
    ...DEFAULT_SETTINGS,
    defaultAccessColor: '#00FF00',
    highlightWidth: 3,
    highlightTransparency: 0.8,
    hoverRenderer: drawHighlight,
    enableEdgeHoverEvents: true,
};

function drawArc(
    context: CanvasRenderingContext2D,
    data: PartialButFor<
        SpecialHighlightNodeDisplayData,
        'x' | 'y' | 'size' | 'label' | 'color'
    >,
    settings: SpecialHighlightSettings,
    radius: number,
    start: number,
    end: number,
    color: string
) {
    context.beginPath();
    context.moveTo(data.x, data.y);
    context.arc(data.x, data.y, radius + settings.highlightWidth, start, end);
    context.fillStyle = color;
    context.fill();
}

export function drawHighlight(
    context: CanvasRenderingContext2D,
    data: PartialButFor<
        SpecialHighlightNodeDisplayData,
        'x' | 'y' | 'size' | 'label' | 'color'
    >,
    settings: SpecialHighlightSettings
): void {
    if (data.highlightColor && data.highlightColor.size > 0) {
        const size = settings.labelSize,
            font = settings.labelFont,
            weight = settings.labelWeight;

        context.font = `${weight} ${size}px ${font}`;

        // Then we draw the label background
        context.fillStyle = context.strokeStyle = '#FFF';
        context.lineWidth = 0.1;

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        // TODO: to figure out if we need shadow or not
        // context.shadowBlur = 12;
        // context.shadowColor = '#000';

        const PADDING = 2;
        let fillStart = 0; // record circle style for later use
        const [fillRadius, fillEnd] = [data.size + PADDING, Math.PI * 2];

        context.beginPath();

        // compute segment arc radian
        const arcRadian =
            (fillEnd - fillStart) /
            (data.highlightColor.size + (data.accessed ? 1 : 0));

        context.globalAlpha = settings.highlightTransparency;
        // draw the highlight ring/arc in different colors specified in highlightColor
        data.highlightColor.forEach((fillColor) => {
            drawArc(
                context,
                data,
                settings,
                fillRadius + settings.highlightWidth,
                fillStart,
                fillStart + arcRadian,
                fillColor
            );
            fillStart += arcRadian;
        });

        if (data.accessed) {
            drawArc(
                context,
                data,
                settings,
                fillRadius + settings.highlightWidth,
                fillStart,
                fillStart + arcRadian,
                settings.defaultAccessColor
            );
        }

        context.closePath();

        context.globalAlpha = 1;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;

        // And finally we draw the label
        drawLabel(context, data, settings as Settings);
    } else {
        drawHover(context, data, settings as Settings);
    }
}
