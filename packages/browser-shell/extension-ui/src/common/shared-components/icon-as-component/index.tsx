import React, { ReactElement, SVGProps } from 'react';
import ButtonTooltip, { TooltipPosition } from '../button-tooltip';

import '../style-element.scss';

type SvgIconProps = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface ISvgTooltipComponentProps {
  tooltipProps: { tooltipText: string; position: TooltipPosition };
  iconProps: {
    icon: SvgIconProps;
    className?: string;
    height?: SVGProps<SVGSVGElement>['height'];
    width?: SVGProps<SVGSVGElement>['width'];
    fill?: SVGProps<SVGSVGElement>['fill'];
  };
  wrapperClassName?: string;
  onClick: () => void;
}

export const SvgTooltipComponent: React.FC<ISvgTooltipComponentProps> = ({
  iconProps,
  tooltipProps,
  onClick,
  wrapperClassName,
}) => {
  const { tooltipText, position } = tooltipProps;

  const {
    height = 20,
    width = 18,
    // fill = "currentColor",
    className,
  } = iconProps;

  const Icon = iconProps.icon;

  return (
    <ButtonTooltip
      tooltipText={tooltipText}
      position={position}
      className='_button-tooltip  ignore-react-onclickoutside'
    >
      <div onClick={onClick} className={wrapperClassName}>
        <Icon
          // fill={fill}
          className={
            className
              ? `${className} buttonElemenet ignore-react-onclickoutside`
              : 'buttonElemenet ignore-react-onclickoutside'
          }
          height={height}
          width={width}
          // style={{ fontSize: "2em", color: "red" }}
        />
      </div>
    </ButtonTooltip>
  );
};
