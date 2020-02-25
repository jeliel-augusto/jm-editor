import styled from "styled-components";
import {Editable} from "slate-react";

export const StyledEditable = styled(Editable)`
    border: 2px solid #3FB1E2;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    min-height: 150px;
`;
export const StyledParagraph = styled.p`
    margin-top: 0.2em;
`;
export const Toolbar = styled.div`
    position: absolute;
    right: 20px;
    top: -25px;
    height: 45px;
    border: 1px solid #3FB1E2;
    background-color: #3FB1E2;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    display: flex;
`;
export const ToolbarButton = styled.button`
    background-color: transparent;
    border:none;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    &:hover svg *{
        fill: rgba(0,0,0, 0.5);
    }
`
export const Container = styled.div`
    position: relative;
    padding-top: 10px;
`;
export const EquationInputContainer = styled.div`
    display: flex;
    position: absolute;
    justify-content: center;
    width: 100%;
    
`;
export const EquationInput = styled.input`
    border: 1px solid #3FB1E2;
    background: none;
    height: 50px;
    font-size: 1.5rem;
    width: 50%;
    display: ${props => props.show ? 'block': 'none'}
`;