import React, { useState, useRef } from 'react';
import { useEventListener } from '../../hooks';

import * as S from './styles';

export type TooltipPosition =
  | 'left'
  | 'leftNarrow'
  | 'leftBig'
  | 'right'
  | 'rightCentered'
  | 'rightContentTooltip'
  | 'top'
  | 'bottom'
  | 'bottomSidebar'
  | 'bottomRightEdge'
  | 'popupLeft';

export interface IButtonTooltipProps {
  tooltipText: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

export const ButtonTooltip: React.FC<IButtonTooltipProps> = ({
  children,
  tooltipText,
  position = 'leftNarrow',
  className,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<{ displayTooltip: boolean }>({
    displayTooltip: false,
  });

  const handleMouseEnter = () => setState({ displayTooltip: true });
  const handleMouseLeave = () => setState({ displayTooltip: false });

  useEventListener('mouseenter', handleMouseEnter, tooltipRef);
  useEventListener('mouseleave', handleMouseLeave, tooltipRef);

  return (
    <S.Container ref={tooltipRef} position={position} className={className}>
      {state.displayTooltip && (
        <S.TooltipBubble
          position={position}
          className='__TooltipBubble ignore-react-onclickoutside'
        >
          <S.TooltipText>{tooltipText}</S.TooltipText>
        </S.TooltipBubble>
      )}

      {children}
    </S.Container>
  );
};

export default ButtonTooltip;
