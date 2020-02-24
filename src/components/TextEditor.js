import React, {useCallback, useMemo, useState} from 'react';
import {createEditor, Transforms, Editor, Text} from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import styled from "styled-components";
const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })

        return !!match
    },
    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },
    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor);
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
};
const StyledEditable = styled(Editable)`
    border: 2px solid #3FB1E2;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
`;
const StyledParagraph = styled.p`
    margin-top: 0.2em;
`;
const Toolbar = styled.div`
    position: absolute;
    right: 20px;
    top: 2px;
    border: 1px solid #3FB1E2;
    background-color: #3FB1E2;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
`;
const ToolbarButton = styled.button`
    background-color: transparent;
    border:none;
    color: white;
`
const Container = styled.div`
    position: relative;
    padding-top: 10px;
`;
export default function TextEditor(){
    const editor = useMemo(()=> withReact(createEditor()), []);
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ]);
    const renderElement = useCallback((props)=>{
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    },[]);
    const renderLeaf = useCallback( (props)=> {
        return <Leaf {...props} />
    }, [])
    return (
        <Container>
            <Slate value={value} editor={editor} onChange={value => setValue(value)}>
                <Toolbar>
                    <ToolbarButton
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                        }}
                    >
                        Bold
                    </ToolbarButton>
                    <ToolbarButton
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                        }}
                    >
                        Code Block
                    </ToolbarButton>
                </Toolbar>
                <StyledEditable onKeyDown={event => {
                    if(!event.ctrlKey) return;
                    switch (event.key) {
                        case '\'': {
                            event.preventDefault();
                            CustomEditor.toggleCodeBlock(editor);
                            break;
                        }
                        case 'b':{
                            event.preventDefault();
                            CustomEditor.toggleBoldMark(editor);
                            break;
                        }
                        default:
                            return;
                    }

                }} renderElement={renderElement} renderLeaf={renderLeaf} />

            </Slate>
        </Container>
    );
}
const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
};
const DefaultElement = props => {
    return (
        <StyledParagraph {...props.attributes}>{props.children}</StyledParagraph>
    )
};
const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
        >
      {props.children}
    </span>
    )
};
