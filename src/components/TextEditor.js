import React, {useCallback, useMemo, useState} from 'react';
import {createEditor, Transforms, Editor, Text, Range} from 'slate'
import { Slate,
    useSelected,
    useFocused,
     withReact } from 'slate-react'
import {ReactComponent as N } from '../N.svg'
import {ReactComponent as Omega} from "../omega.svg";
import {ReactComponent as Italic} from "../I.svg";
import {ReactComponent as Sub} from "../sub.svg";
import {ReactComponent as Image} from "../picture.svg";
import {ReactComponent as Upper} from "../up.svg";
import {ReactComponent as Down} from "../down.svg";
import {ReactComponent as Video} from "../video-camera.svg";
import {
    Container,
    EquationInput,
    EquationInputContainer,
    StyledEditable,
    StyledParagraph,
    Toolbar,
    ToolbarButton
} from './editor-styles';
import MathJax from "react-mathjax2";
const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })
        return !!match
    },
    isItalicMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.italic === true,
            universal: true,
        })
        return !!match
    },
    isUnderlineActive(editor){
        const [match] = Editor.nodes(editor, {
            match: n => n.under === true,
            universal: true,
        });
        return !!match;
    },
    isSupActive(editor){
        const [match] = Editor.nodes(editor, {match: n => n.type === 'sup'});
        return !!match;
    },
    isSubActive(editor){
        const [match] = Editor.nodes(editor, {match: n => n.type === 'sub'});
        return !!match;
    },
    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor);
        if(isActive){
            Editor.removeMark(editor, 'bold');
        }else{
            Editor.addMark(editor, 'bold', true);
        }
    },
    toggleItalicMark(editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor);
        if(isActive){
            Editor.removeMark(editor, 'italic');
        }else{
            Editor.addMark(editor, 'italic', true);
        }
    },
    toggleSupMark(editor) {
        const isActive = CustomEditor.isSupActive(editor);
        if(isActive){
            Editor.removeMark(editor, 'sup');
        }else{
            Editor.removeMark(editor, 'sub');
            Editor.addMark(editor, 'sup', true);
        }
    },
    toggleSubMark(editor){
        const isActive = CustomEditor.isSubActive(editor);
        if(isActive){

            Editor.removeMark(editor, 'sub');
        }else{
            Editor.removeMark(editor, 'sup');
            Editor.addMark(editor, 'sub', true);
        }
    },
    toggleUnderlineMark(editor){
        const isActive = CustomEditor.isUnderlineActive(editor);
        if(isActive){
            Editor.removeMark(editor, 'under');
        }else{
            Editor.addMark(editor, 'under', true);
        }
    }
};
const withEquation = editor => {
    const { isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'equation' ? true : isVoid(element)
    }

    return editor
};
const insertEquation = (editor, equation) =>{
    Transforms.insertNodes(editor, {
        type: 'equation',
        equation,
        children: [{text: ''}]
    });
};
export default function TextEditor(){
    const editor = useMemo(()=> withEquation(withReact(createEditor())), []);
    const [value, setValue] = useState([
        {
            type: 'paragraph',
            children: [{text: ''}],
        },
    ]);
    const [showInputEquation, setShowInputEquation] = useState(false);
    const renderElement = useCallback((props)=>{
        switch (props.element.type) {
            case 'equation':
                return <EquationElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    },[]);

    const renderLeaf = useCallback( (props)=> {
        return <Leaf {...props} />
    }, [])
    return (
        <MathJax.Context
            script='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_SVG'
            input='ascii' options={{
            output: 'SVG',
            asciimath2jax: {

                useMathMLspacing: true,
                delimiters: [["$$","$$"]],
                preview: "none",
            }}}
        >
            <Container>
                <Slate value={value} editor={editor} onChange={value => { setValue(value); }}>
                    <Toolbar>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                            }}
                        >
                            <N></N>
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()
                                CustomEditor.toggleItalicMark(editor);
                            }}
                        >
                            <Italic />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault();
                                CustomEditor.toggleUnderlineMark(editor);
                            }}
                        >
                            <Sub />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()
                                CustomEditor.toggleSubMark(editor);

                            }}
                        >
                            <Down />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()
                                CustomEditor.toggleSupMark(editor);
                            }}
                        >
                            <Upper />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault();
                                setShowInputEquation((prevState)=> !prevState);
                                insertEquation(editor, '');
                            }}
                        >
                            <Omega />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()

                            }}
                        >
                            <Image />
                        </ToolbarButton>
                        <ToolbarButton
                            onMouseDown={event => {
                                event.preventDefault()

                            }}
                        >
                            <Video />
                        </ToolbarButton>
                    </Toolbar>
                    <StyledEditable onKeyDown={event => {

                        if(!event.ctrlKey) return;
                        switch (event.key) {
                            case 'b':{
                                event.preventDefault();
                                CustomEditor.toggleBoldMark(editor);
                                break;
                            }
                            case 'i':
                                event.preventDefault();
                                CustomEditor.toggleItalicMark(editor);
                                break;
                            default:
                                return;
                        }

                    }} renderElement={renderElement} renderLeaf={renderLeaf} />

                </Slate>
            </Container>
        </MathJax.Context>

    );
}
const EquationElement = props=> {
    return (
        <div {...props.attributes} >
            <div contentEditable={false} style={{'display': 'inline-block'}}>
                <MathJax.Node>{props.element.equation}</MathJax.Node>
            </div>{props.children}
        </div>

    )
}
const DefaultElement = props => {
    return (
        <StyledParagraph {...props.attributes}>{props.children}</StyledParagraph>
    )
};

const Leaf = props => {
    if(props.leaf.sub){
        return (
            <sub
                {...props.attributes}
                style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal',
                    fontStyle: props.leaf.italic ? 'italic': 'normal'}}
                    >
              {props.children}
            </sub>
        )
    }else if(props.leaf.sup){
        return (
            <sup
                {...props.attributes}
                style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal',
                    fontStyle: props.leaf.italic ? 'italic': 'normal'}}>
                {props.children}
            </sup>
        )
    }
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal',
                fontStyle: props.leaf.italic ? 'italic': 'normal',
                textDecoration: props.leaf.under ? 'underline': 'none'}}

        >
      {props.children}
    </span>
    )

};
