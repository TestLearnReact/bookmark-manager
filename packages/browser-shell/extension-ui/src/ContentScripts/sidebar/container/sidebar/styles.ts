import {
  createGlobalStyle,
  css,
  styled,
} from '../../../../common/styles/styled-component';

import { Rnd } from 'react-rnd';

export const GlobalStyle = createGlobalStyle<{
  sidebarWidth: string;
}>`
 

    .__SidebarContainer {
      font-size: 15px;
      color: gray;
    }

    .sidebar-draggable {
        height: 100% !important;
    }
    .sidebarResizeHandle {
        width: 5px;
        height: 100vh;
        position: absolute;
        top: 0px;
        background: ${(props) => props.theme.themeColors.backgroundLight};
        // margin-left: 20px;
        &:hover {
            background: #5671cf30;
        }
    }
    #outerContainer {
        width: ${(props) => props.sidebarWidth};
    }
  `;

export const SidebarContainer = styled.div`
  height: 100vh;
  width: 450px;
  position: fixed;
  right: 0;
  top: 0;
  // margin-right: 41px;
  background-color: transparent;
  z-index: 9999999999999999;
  pointer-events: none;
`;

const tt = (props) => {
  console.log('props.theme', props.theme);
  return props.theme.themeColors.backgroundDark;
};

export const SidebarResize = styled(Rnd)<{
  locked: boolean;
  peeking: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: start;
  z-index: 3000;
  position: relative;
  border-left: solid 1px ${(props) => props.theme.themeColors.lineColor};
  background: ${(props) => tt(props)};
  // color: ${({ theme }) => theme?.themeColors.textColor};
  pointer-events: auto;
`;

// export const OuterContainerStyled = styled.div`
//   height: 100vh;
//   overflow-x: visible;
//   position: fixed;
//   padding: 0px 0px 10px 0px;
//   right: ${({ theme }) => theme?.constants.rightOffsetPx ?? 0};
//   top: ${({ theme }) => theme?.constants.topOffsetPx ?? 0};
//   padding-right: ${({ theme }) => theme?.constants.paddingRight ?? 0};
//   z-index: 999999899; /* This is to combat pages setting high values on certain elements under the sidebar */
//   background: ${(props) => props.theme.themeColors.backgroundDark};
//   transition: all 0.1s cubic-bezier(0.65, 0.05, 0.36, 1) 0s;
//   border-left: 1px solid ${({ theme }) => theme.themeColors.lineColor};
//   font-family: 'Inter', sans-serif;
//   &::-webkit-scrollbar {
//     display: none;
//   }
//   scrollbar-width: none;
// `;

// export const InnerContainerStyled = styled.div<{
//   sidebarWidth: string;
// }>`
//   position: relative;
//   left: 0;
//   top: 0;
//   height: 100%;
//   width: ${(props) =>
//     `calc(${props.sidebarWidth} - ${props.theme?.constants.toolbarWidtExpanded})` ??
//     0};
//   overflow-x: visible;
//   background: ${(props) => props.theme.themeColors.backgroundDark};
//   color: ${({ theme }) => theme?.themeColors.textColor};
// `;
