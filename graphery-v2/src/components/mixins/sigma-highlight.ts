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
    if (data.highlighted && data.highlightColor) {
        const size = settings.labelSize,
            font = settings.labelFont,
            weight = settings.labelWeight;

        context.font = `${weight} ${size}px ${font}`;

        // Then we draw the label background
        context.fillStyle = context.strokeStyle = '#FFF';
        context.lineWidth = 0.1;

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        // context.shadowBlur = 8;
        // context.shadowColor = '#000';

        const PADDING = 2;
        let fillRadius: number, fillStart: number, fillEnd: number; // record circle style for later use

        if (typeof data.label === 'string') {
            const textWidth = context.measureText(data.label).width,
                boxWidth = Math.round(textWidth + 5),
                boxHeight = Math.round(size + 2 * PADDING),
                radius = Math.max(data.size, size / 2) + PADDING;

            const angleRadian = Math.asin(boxHeight / 2 / radius);
            const xDeltaCoord = Math.sqrt(
                Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2))
            );

            context.beginPath();
            context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
            context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
            context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
            context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
            context.fill();
            context.closePath();
            [fillRadius, fillStart, fillEnd] = [
                radius,
                angleRadian,
                Math.PI * 2 - angleRadian, // make it positive so that we can compute chunks
            ];
        } else {
            context.beginPath();
            [fillRadius, fillStart, fillEnd] = [
                data.size + PADDING,
                0,
                Math.PI * 2,
            ];
        }

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
