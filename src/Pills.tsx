import React from 'react';
import { PillData } from './App';
import { Pill } from './Pill';
import { pillStyle, pillWithHeaderStyle } from './pill.css';

// Headers separated from pills data for performance improvement.
// Headers will change more often than pills and this should not cause extra layout work.
// Alternatively we could compare pills text (not the general array reference) every time prop changes and based on that recalculate layout or not.
interface PillsProps {
  pills: PillData[];
  headers: string[];
  toggleHeader: (id: string) => void;
}

interface LayoutBreakElement {
  index: number;
  type: 'line-break';
}

interface LayoutPillElement {
  index: number;
  type: 'pill';
  pill: PillData;
}

type LayoutElement = LayoutBreakElement | LayoutPillElement;

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const containerNode = React.useRef<HTMLDivElement>(null);
  const [layoutElements, setLayoutElements] = React.useState<LayoutElement[]>(
    []
  );
  const initialRender = React.useRef(true);

  function forceLayoutRecalculation() {
    setLayoutElements([]);
  }

  // recalculate layout on window resize
  React.useEffect(() => {
    function resizeListener() {
      forceLayoutRecalculation();
    }
    // * can be debounced to prevent excessive layout recalculations
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // recalculate layout on pills prop change
  React.useEffect(() => {
    // skip this effect on component initial render to avoid duplicate calculation
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    forceLayoutRecalculation();
  }, [pills]);

  React.useLayoutEffect(() => {
    if (containerNode.current && layoutElements.length === 0) {
      const pillNodesForMeasurement = containerNode.current.querySelectorAll(
        `.${pillStyle}:not(.${pillWithHeaderStyle})`
      );
      const pillNodeWithHeaderStyles = containerNode.current.querySelector(
        `.${pillStyle}.${pillWithHeaderStyle}`
      );

      const withHeaderWidth =
        pillNodeWithHeaderStyles?.getBoundingClientRect().width;
      const withoutHeaderWidth =
        pillNodesForMeasurement[0]?.getBoundingClientRect().width;
      // no pills, abort layout calculation
      if (!withHeaderWidth || !withoutHeaderWidth) {
        return;
      }

      const extraWidthForHeaderStyles = withHeaderWidth - withoutHeaderWidth;

      const pillWidths: number[] = [];
      pillNodesForMeasurement.forEach((node) => {
        pillWidths.push(node.getBoundingClientRect().width);
      });

      const lineWidth = containerNode.current.getBoundingClientRect().width;

      const newLayoutElements: LayoutElement[] = [];
      let currentLineWidth = 0;
      pillWidths.forEach((width, i) => {
        if (currentLineWidth + width + extraWidthForHeaderStyles > lineWidth) {
          newLayoutElements.push({ type: 'line-break', index: i });
          currentLineWidth = 0;
        }

        newLayoutElements.push({ type: 'pill', index: i, pill: pills[i] });
        currentLineWidth += width + extraWidthForHeaderStyles;
      });
      setLayoutElements(newLayoutElements);
    }
  }, [layoutElements]);

  return (
    <>
      <div ref={containerNode}>
        {layoutElements.length ? (
          layoutElements.map((el) => {
            if (el.type === 'line-break') {
              return <br key={`__${el.type}-${el.index}`} />;
            } else {
              return (
                <Pill
                  key={el.pill.id}
                  header={headers.includes(el.pill.id)}
                  onClick={() => {
                    toggleHeader(el.pill.id);
                  }}
                >
                  {el.pill.value}
                </Pill>
              );
            }
          })
        ) : pills.length ? (
          // rendering to measure pill sizes
          // renders 1 pill with header set to true (needed to calculate difference in width between header and non-header pill)
          // renders all pills with header set to false to get basic width (to calculate their placement)
          <>
            <Pill key={`__selected-${pills[0].id}`} header={true}>
              {pills[0].value}
            </Pill>
            {pills.map((pill: any) => (
              <Pill key={`__pill-${pill.id}`} header={false}>
                {pill.value}
              </Pill>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}

// * Potential improvements:
// - optimize to squeeze all pills in minimal amount of lines (if the order doesn't matter)
