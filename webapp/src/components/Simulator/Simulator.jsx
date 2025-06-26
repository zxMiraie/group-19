import React from 'react';
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs/components/prism-core";
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import { Link } from "react-router-dom";
import { ContainerProvider } from "../../pages/Container/Container";

function parseBooleanLogic(str) {
    let stack = [];
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "(") {
            stack.push(i);
        } else if (str[i] === ")") {
            let start = stack.pop();
            let subStr = str.slice(start + 1, i);
            result += eval(subStr);
        } else if (stack.length === 0) {
            result += str[i];
        }
    }
    return eval(result);
}
function tokenize(expression) {
    const tokenPattern = /\s*(\d+\.\d+|\d+|[+\-*/()])/g;
    const tokens = [];
    let match;
    while ((match = tokenPattern.exec(expression)) !== null) {
        tokens.push(match[1]);
    }
    return tokens;
}

function parse(tokens) {
    function parseExpression() {
        let left = parseTerm();
        while (tokens.length > 0 && "+-".includes(tokens[0])) {
            const op = tokens.shift();
            const right = parseTerm();
            left = { op, left, right };
        }
        return left;
    }

    function parseTerm() {
        let left = parseSignedFactor();
        while (tokens.length > 0 && "*/".includes(tokens[0])) {
            const op = tokens.shift();
            const right = parseSignedFactor();
            left = { op, left, right };
        }
        return left;
    }

    function parseSignedFactor() {
        let sign = 1;
        if (tokens[0] === "-") {
            sign = -1;
            tokens.shift();
        }
        const factor = parseFactor();
        return (typeof factor === "number") ? factor * sign : factor;
    }

    function parseFactor() {
        if (/^\d+(\.\d+)?$/.test(tokens[0])) {
            return parseFloat(tokens.shift());
        } else if (tokens[0] === "(") {
            tokens.shift();
            const expr = parseExpression();
            tokens.shift();
            return expr;
        }
    }

    return parseExpression();
}

function evaluate(ast) {
    if (typeof ast === "number") {
        return ast;
    }
    const { op, left, right } = ast;
    if (op === "+") {
        return evaluate(left) + evaluate(right);
    } else if (op === "-") {
        return evaluate(left) - evaluate(right);
    } else if (op === "*") {
        return evaluate(left) * evaluate(right);
    } else if (op === "/") {
        return evaluate(left) / evaluate(right);
    }
}

function interpret(expression) {
    const tokens = tokenize(expression);
    const ast = parse(tokens);
    return evaluate(ast);
}

function* range(from, to, step = 1) {
    let value = from;
    while (value <= to) {
        yield value;
        value += step;
    }
}







var CodeContext = "";


const PythonBooleanRegex = new RegExp(/\b(?:false|none|true)\b/,"g")
const PythonVariableRegex = new RegExp(/[A-Za-z][A-Za-z_0-9]*/,"g")
const PythonOperatorRegex = new RegExp(/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,"g")
const PythonNumberRegex = new RegExp(/\d+\.?\d*/,"g")
const PythonBracketRegex = new RegExp(/[()]/,"g")
const PythonCurlyBracketRegex = new RegExp(/[{}]/,"g")
const PythonKeywordRegex =new RegExp(/\b(?:if|elif|else)\b/,"g")



export class SimulatorEditor extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            value: 'x=5\nif (false){\nx=x+1\n}elif (true){\nx=x*3\n}else{\nx=x*x\n}\ny=((12*12)-4)/10\ny=y/10\nz=x+1',
            redirect: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);



    }



    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        CodeContext = this.state.value;





    }


    render() {
        const RedirectElement = () => {
            CodeContext = this.state.value
        }
        return (
            <div>
                <ContainerProvider maxWidth="xl" sx={{ padding: "1rem" }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" component="h2" align="center">
                            Reverse Computation Simulator
                        </Typography>
                    </Container>
                </ContainerProvider>
                <Box
                    onSubmit={this.handleSubmit}
                    component="form"
                    noValidation
                    sx={(theme) => ({
                        "& > :not(style)": {
                            m: 1,
                        },
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        height: "50vh",
                        flexGrow: "1",
                        flexBasis: "100%",
                        justifyContent: "center",
                        [theme.breakpoints.down("sm")]: {
                            marginTop: "40%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        [theme.breakpoints.down("xs")]: {
                            marginTop: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        [theme.breakpoints.down("md")]: {
                            marginTop: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    })}
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    height="50vh"
                    flexGrow={1}
                    flexBasis="100%"
                    justifyContent="center"
                >
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Editor
                                value={this.state.value}
                                onChange={this.handleChange}
                                tabSize={4}
                                highlight={code => highlight(code, languages.py)}
                                padding={10}
                                style={{
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "dimgrey",
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 18,
                                    height: "30vh",
                                    overflow: "auto",
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Link to={"/simulator/run"}>
                                <Button
                                    onClick={RedirectElement}
                                    type="submit"
                                    variant="contained"
                                    fullWidth={true}
                                >
                                Run
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        );
    }
}


function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

export class SimulatorRunner extends React.Component{



    constructor(props) {
        super(props);
        this.state = {
            value: CodeContext,
            stepcount: 0,
            currentline: 0,
            stepline:[],
            stepf : false,
            stepb : true,
            error : "",
            keystack: [],
            arraystring: this.splitToLines(CodeContext),
            variables: [{title: "", values:[""],currentval:""}]
            //{title: "q2173", values:["1"],currentval:"1"}
        };

        this.handleChange = this.handleChange.bind(this);
    }

    splitToLines(stringInput){
        var finalArray = [];
        while (stringInput.indexOf("\n") !== -1){
            finalArray.push(stringInput.slice(0,stringInput.indexOf("\n")))
            stringInput=stringInput.slice(stringInput.indexOf("\n")+1)

        }
        finalArray.push(stringInput)
        return finalArray
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    onClick = (type) =>{
        this.setState(prevState => (
            {stepb : ( prevState.stepcount === 1 && type === 'back'),
                stepf: (prevState.currentline===prevState.arraystring.length-1 && type === 'forward'),

                stepcount : type === 'forward' ? prevState.stepcount + 1: prevState.stepcount - 1,
                currentline: type === 'forward' ? prevState.currentline + 1: prevState.currentline - 1
            }));



        if (type === 'forward'){
            this.stepForward(this.state.arraystring[this.state.currentline])
        }else if (type === 'back'){
            this.stepBack()
        }
    }


    stepBack = () =>{
        var varStore=this.state.variables;
        let crtarray=this.parseLineToArray(this.state.arraystring[this.state.currentline-1])
        console.log(crtarray)
        console.log(this.state.currentline)
        console.log(this.state.stepcount)
        console.log(this.state.stepline)
        let crtline=this.state.stepline.pop()
        console.log(crtline)
        console.log(this.state.currentline-1 === crtline)
        if (crtarray[0].cont==="}"){
            this.setState(prevState => (
                {currentline: crtline
                }
            ))
        }else if (this.state.currentline-1 === crtline) {
            for (let i = 0; i < this.state.variables.length; i++) {
                //console.log(this.state.variables[i].values[this.state.variables[i].values.length-1])
                if ((this.state.variables[i].values[this.state.variables[i].values.length - 2] === null)) {
                    var temp = varStore.pop(i)
                } else {
                    var temp = varStore[i].values.pop(varStore[i].values.length)
                    //console.log(varStore[i].values)
                    //console.log(varStore[i].values[varStore[i].values.length - 1])
                    varStore[i].currentval = varStore[i].values[varStore[i].values.length - 1]
                }

            }
        }else{
            this.setState(prevState => (
                {currentline: crtline
                }
            ))

        }

    }


    stepForward = (linetext ) => {
        var lineArray = this.parseLineToArray(linetext)
        // console.log(this.state.currentline)
        if (lineArray[0].type === "keyword" || lineArray[0].type ==="rcurl" ){
            var crtline = this.state.currentline
            let crtarray = this.parseLineToArray(this.state.arraystring[crtline])

            var skipOver = this.state.keystack
            // console.log(crtline)
            // console.log(crtarray)
            // console.log(skipOver)




            if (lineArray[0].cont==="if" && lineArray.length !== 1){
                crtline=this.decisionStates(lineArray,this.decisionBool(lineArray,1),crtline)
                crtarray = this.parseLineToArray(this.state.arraystring[crtline])
                //console.log(crtarray)
                if(this.decisionBool(lineArray,1) === true){
                    this.state.keystack.push(true)
                }else{
                    this.state.keystack.push(false)
                }

            }else if (crtarray[0].type==="rcurl") {
                //console.log(this.state.keystack)
                if (crtarray.length === 1){
                    this.state.keystack.pop()
                    crtline++

                }else if (crtarray[1].cont === "elif" ) {
                    console.log(this.state.keystack)
                    if (this.state.keystack[this.state.keystack.length-1]===false){
                        crtline = this.decisionStates(crtarray, this.decisionBool(crtarray, 2), crtline)
                        if (this.decisionBool(crtarray, 2) === true) {
                            this.state.keystack.pop()
                            this.state.keystack.push(true)
                        }
                    }else{
                        crtline = this.decisionStates(crtarray, false, crtline)
                    }

                } else if (crtarray[1].cont === "else") {
                    if (this.state.keystack[this.state.keystack.length-1]===false) {
                        crtline++
                    } else{
                        crtline = this.decisionStates(crtarray, false, crtline)
                    }

                }
            }
            //var finalVariables =[]
            //
            // this.state.variables.forEach((variable) => {
            //     let arry = variable.values
            //     arry.push(arry[arry.length-1])
            //     finalVariables.push({title: variable.title, values: arry,currentval: arry[arry.length-1]})
            // })

            this.state.keystack.push(false)


            this.setState(prevState => (
                {currentline: crtline,
                    }//variables: finalVariables
            ))
            let d=this.state.keystack.pop()

        }else if (lineArray[0].type ==="variable" && lineArray[1].cont ==="=")
        { //assigning variables
            let evalstring="";
            var boolTrue=false;
            for (const i of range(2,lineArray.length-1)){
                if (lineArray[i].type==="boolean"){
                    boolTrue = true;

                }

                if (lineArray[i].type ==="variable"){
                    var varIndex = arrayObjectIndexOf(this.state.variables,lineArray[i].cont,"title")
                    if (varIndex !== -1){

                        evalstring= evalstring + this.state.variables[varIndex].currentval
                    }
                }else{
                    evalstring= evalstring + lineArray[i].cont
                }
            }


            console.log(evalstring)

            if (boolTrue){
                var val =parseBooleanLogic(evalstring)+""

            } else{
                var val =interpret(evalstring)+""
            }

            let assignIndex = arrayObjectIndexOf(this.state.variables,lineArray[0].cont,"title")
            var finalVariables =[]

            this.state.variables.forEach((variable) => {
                let arry = variable.values
                arry.push(arry[arry.length-1])
                finalVariables.push({title: variable.title, values: arry,currentval: arry[arry.length-1]})
            })





            if (-1 === assignIndex){
                let empty =[]
                for (let k =0;k<this.state.variables[0].values.length-1;k++){

                    empty.push(null)
                }
                empty.push(val)

                finalVariables.push({title: lineArray[0].cont, values: empty, currentval:val})
            }else{
                finalVariables[assignIndex].currentval=val
                finalVariables[assignIndex].values[finalVariables[assignIndex].values.length-1]=val
                console.log(finalVariables[assignIndex])
            }


            console.log(finalVariables)

            this.setState(prevState => (
                {variables: finalVariables}
            ))
        } else
        {
            var finalVariables =[]

            this.state.variables.forEach((variable) => {
                let arry = variable.values
                arry.push(arry[arry.length-1])
                finalVariables.push({title: variable.title, values: arry,currentval: arry[arry.length-1]})
            })
            this.setState(prevState => (
                {variables: finalVariables
                }
            ))

        }
        let steplineset=this.state.stepline
        steplineset.push(this.state.currentline)
        //console.log(steplineset)
        this.setState(prevState => (
            {stepline: steplineset
            }
        ))



    }



    parseLineToArray = (line) => {
        if (line==null) {
            return null
        }


        var LineCode=[]


        let keywordmatches = [...line.matchAll(PythonKeywordRegex)];
        keywordmatches.forEach((keywordmatch) => {
            LineCode.push({type:"keyword", cont:keywordmatch[0], position:keywordmatch.index})
            //console.log("match found at " + keywordmatch.index + "\nWith value of " + keywordmatch);
        });
        let boolmatches = [...line.matchAll(PythonBooleanRegex)];
        boolmatches.forEach((boolmatch) => {
            LineCode.push({type:"boolean", cont:boolmatch[0], position:boolmatch.index})
            //console.log("match found at " + boolmatch.index + "\nWith value of " + boolmatch);
        });
        let varmatches = [...line.matchAll(PythonVariableRegex)];
        varmatches.forEach((varmatch) => {
            LineCode.push({type:"variable", cont:varmatch[0], position:varmatch.index})
            //console.log("match found at " + varmatch.index + "\nWith value of " + varmatch);
        });
        let bracketmatches = [...line.matchAll(PythonBracketRegex)]; //searches through the line and adds returns an array of operators and their indexes in the line
        bracketmatches.forEach((bracketmatch) => {
            if (bracketmatch[0]==="("){
                LineCode.push({type:"lbracket", cont:bracketmatch[0], position:bracketmatch.index})
                //console.log("l match found at " + bracketmatch.index + "\nWith value of " + bracketmatch);
            }else{
                LineCode.push({type:"rbracket", cont:bracketmatch[0], position:bracketmatch.index})
                //console.log("r match found at " + bracketmatch.index + "\nWith value of " + bracketmatch);
            }


        });
        let opmatches = [...line.matchAll(PythonOperatorRegex)]; //searches through the line and adds returns an array of operators and their indexes in the line
        opmatches.forEach((opmatch) => {
            LineCode.push({type:"operator", cont:opmatch[0], position:opmatch.index})
            //console.log("match found at " + opmatch.index + "\nWith value of " + opmatch);
        });

        let nummatches = [...line.matchAll(PythonNumberRegex)];
        nummatches.forEach((nummatch) => {
            LineCode.push({type:"number", cont:nummatch[0], position:nummatch.index})
            //console.log("match found at " + nummatch.index + "\nWith value of " + nummatch);
        });
        let curlmatches = [...line.matchAll(PythonCurlyBracketRegex)];
        curlmatches.forEach((curlmatch) => {
            if (curlmatch[0]==="{"){
                LineCode.push({type:"lcurl", cont:curlmatch[0], position:curlmatch.index})
                //console.log("l match found at " + curlmatch.index + "\nWith value of " + curlmatch);
            }else{
                LineCode.push({type:"rcurl", cont:curlmatch[0], position:curlmatch.index})
                //console.log("r match found at " + curlmatch.index + "\nWith value of " + curlmatch);
            }
        });


        LineCode.sort(function (a,b){return a.position - b.position})
        for (let i = 0; i< LineCode.length-2;i++){
            let temp= LineCode.slice(i+1)
            let temp2 = arrayObjectIndexOf(temp,LineCode[i].position,"position")
            if(temp2!==-1){
                LineCode.splice(i+1, 1);
            }
        }
        LineCode.sort(function (a,b){return a.position - b.position})




        return LineCode

    }

    decisionBool =  (lineArray,start) =>{
        var ii =start;
        let boolstring ="";
        while (lineArray[ii].type !== "lcurl"){
            if (lineArray[ii].type ==="variable"){
                var tempIndex = arrayObjectIndexOf(this.state.variables,lineArray[ii].cont,"title")
                if (tempIndex !== -1){

                    boolstring= boolstring + this.state.variables[tempIndex].currentval
                }
            }else{
                boolstring=boolstring + lineArray[ii].cont
            }
            ii++
        }
        return parseBooleanLogic(boolstring)
    }


    decisionStates = (lineArray,tfBool,crtline) => {

        if(tfBool){
            return crtline+1
        }else{
            let curls = ["{"]
            let first = true

            while (curls.length!==0){ //&& this.stepcount===this.arraystring.length-1
                crtline=crtline+1;

                let crtarray = this.parseLineToArray(this.state.arraystring[crtline])
                let lcurly = -1
                let rcurly = -1
                if (crtarray!==[]){
                    lcurly = arrayObjectIndexOf(crtarray,"lcurl","type")
                    rcurly = arrayObjectIndexOf(crtarray,"rcurl","type")
                }

                if (rcurly !== -1){
                    let a = curls.pop()
                }
                if (curls.length!==0)
                    if (lcurly !== -1){
                        curls.push("{")
                    }

                // console.log(crtline)
                // console.log(curls)
                // console.log(crtarray)




            }
            // while(crtarray[rcurly+1].type === "keyword" && crtarray[rcurly].type ==="rcurl"){
            //     if (crtarray[rcurly+1].cont==="elif"){
            //
            //
            //
            //     }
            // }


            return crtline


        }

    }

    render() {
        return (
            <div>
                <ContainerProvider maxWidth="xl" sx={{ padding: "1rem" }}>
                    <Typography variant="h4" component="h2" align="center">
                        Reverse Computation Simulator
                    </Typography>
                </ContainerProvider>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={4} style={{ height: "auto" }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Code running:
                        </Typography>
                            <Editor
                                value={this.state.value}
                                onChange={this.handleChange}
                                tabSize={4}
                                highlight={(code) => highlight(code, languages.py)}
                                padding={10}
                                disabled={true}
                                style={{
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    borderColor: "dimgrey",
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 18,
                                    height: "50vh",
                                    overflow: "auto",
                                }}
                            />
                        <Typography variant="h4" gutterBottom component="div">
                            Current step: {this.state.stepcount} Current line: {this.state.currentline}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="flex-start"
                            flexDirection="row"
                            flexGrow={1}
                            flexBasis="100%"
                            justifyContent="flex-end"
                        >
                            <Button
                                onClick={() => this.onClick("back")}
                                disabled={this.state.stepb}
                                variant="contained"
                                fullWidth={true}
                                style={{ flexGrow: 1, marginRight: "0.5rem" }}
                            >
                                Step back
                            </Button>

                            <Button
                                onClick={() => this.onClick("forward")}
                                disabled={this.state.stepf}
                                variant="contained"
                                fullWidth={true}
                                style={{ flexGrow: 1, marginRight: "0.5rem" }}
                            >
                                Step Forward
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} style={{ height: "auto" }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Memory:
                        </Typography>
                        <React.Fragment>
                            <ul className="list-group">
                                {this.state.variables.map((listitem) => (
                                    <li key={listitem.id} className="list-group-item">
                                        Name: {listitem.title} Value: {listitem.currentval}
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    </Grid>
                    <Grid item xs={12} md={8} style={{ height: "auto" }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6} mt={5}>
                                <Link to={"/simulator/edit"} style={{ textDecoration: "none" }}>
                                    <Button
                                        variant="contained"
                                        fullWidth={true}
                                        style={{ flexGrow: 1, marginRight: "0.5rem" }}
                                    >
                                        Go back to editor
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );

    }

}