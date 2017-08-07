/* eslint quote-props: "off" */

/*
 * This will hold all of our keywords information such as the hashmap that
 * holds the keywords with their tool-tip values in it.
 */
function KeywordsHashTable(obj) {
    this.length = 0;
    this.items = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            this.items[k] = obj[k];
            this.length++;
        }
    }
    this.getTip = function (word) {
        return this.items[word];
    };
    this.hasKeyword = function (word) {
        return this.items.hasOwnProperty(word);
    };
}

/* Important keywords that need explanation with a tool-tip.
 * Only some of the keywords are displayed here because only some are used
 * and some are self-explanatory.
 */
var keywordsTable = new KeywordsHashTable({
    "abs" : "",
    "ad" : "",
    "absurdum" : "",
    "all" : "",
    "alters" : "The implementer may leave an arbitrary value of the same type at the end of the operation. This provides the most flexibility to the implementers.",
    "alt" : "The implementer may leave an arbitrary value of the same type at the end of the operation. This provides the most flexibility to the implementers.",
    "alternative" : "",
    "and" : "",
    "Array" : "",
    "Aux_Code" : "",
    "Aux_Var" : "",
    "Aux_Vars" : "",
    "Aux" : "",
    "Auxiliary" : "",
    "Axiom" : "",
    "B" : "",
    "Base_Case" : "",
    "By" : "",
    "by" : "",
    "Cart_Prod" : "",
    "Categorical" : "",
    "Case" : "",
    "changing" : "This parameter will be changed throughout the clause.",
    "clears" : "The entry will be re-initialized to the initial value of the same type by the end of the operation.",
    "clr" : "The entry will be re-initialized to the initial value of the same type by the end of the operation.",
    "common" : "",
    "Commutativity" : "",
    "complement" : "",
    "Concatenation" : "This connects the first and second parameters into a chain of the same type. Parentheses are mandatory around Concatenation expressions",
    "concatenation" : "This connects the first and second parameters into a chain of the same type. Parentheses are mandatory around Concatenation expressions",
    "concept" : "This is similar to some object-oriented programing language's header file or class declaration. This file contains the data structure template that includes the mathematical model used to represent that type, the constraints, and a list of all operations along with their pre- and post-conditions.",
    "Concept" : "This is similar to some object-oriented programing language's header file or class declaration. This file contains the data structure template that includes the mathematical model used to represent that type, the constraints, and a list of all operations along with their pre- and post-conditions.",
    "conclusion" : "",
    "Confirm" : "",
    "conjunct" : "",
    "Constraint" : "",
    "Constraints" : "",
    "constraint" : "",
    "constraints" : "",
    "contradiction" : "",
    "convention" : "This clause contains constraints on the realization records in order to keep the implementations of all the various operations consistent. This can be singular or plural. It is also referred to as the representation invariant. ",
    "conventions" : "This clause contains constraints on the realization records in order to keep the implementations of all the various operations consistent. This can be singular or plural. It is also referred to as the representation invariant. ",
    "Convention" : "This clause contains constraints on the realization records in order to keep the implementations of all the various operations consistent. This can be singular or plural. It is also referred to as the representation invariant.",
    "Corollary" : "",
    "Correspondence" : "This clause explains how to read the value in the Contents array as the string described in conceptualization. This clause is necessary to check that the code for the procedures satisfies their respective specifications. It is also referred to as the abstraction function or abstraction relation.",
    "correspondence" : "This clause explains how to read the value in the Contents array as the string described in conceptualization. This clause is necessary to check that the code for the procedures satisfies their respective specifications. It is also referred to as the abstraction function or abstraction relation.",
    "decreasing" : "This clause specifies a progress metric that is a natural number which reduces on each pass through the loop. This loop must eventually terminate because there is not an infinite strictly decreasing sequence of natural numbers. ",
    "Deduction" : "",
    "Defines" : "",
    "defines" : "",
    "definition" : "Introducing a new mathematical function.",
    "def" : "Introducing a new mathematical function.",
    "Definition" : "Introducing a new mathematical function.",
    "Def" : "Introducing a new mathematical function.",
    "distribution" : "",
    "div" : "",
    "do" : "Perform these operations upon ensuring that the 'While' clause is true.",
    "else" : "",
    "elimination" : "",
    "end" : "This finishes whatever operation it corresponds to. You must have this to stop every operation and begin another.",
    "enhanced" : "",
    "enhancement" : "This means that the code below can use any of the information in the concept in the specification or realization of the enhancement. Also, enhancements are just a layout of different procedures that you might wish to add to a concept.",
    "Enhancement" : "This means that the code below can use any of the information in the concept in the specification or realization of the enhancement. Also, enhancements are just a layout of different procedures that you might wish to add to a concept.",
    "ensures" : "Post-conditions, or guarantees, that will happen if the requires clause is correct.",
    "equality" : "",
    "evaluates" : "Any argument passed for that parameter must be a functional expression that will be evaluated when the operation is called.",
    "eval" : "Any argument passed for that parameter must be a functional expression that will be evaluated when the operation is called.",
    "excluded" : "",
    "exemplar" : "An identifier that stands for an arbitrary value which tells the client what is true of every variable that is of this class type.",
    "existantial" : "",
    "exists" : "",
    "exit" : "",
    "Facility" : "This is similar to Java in that every file is a class, and this facility's name should be the same as the name of the file that declares it. You need this statement at the beginning to declare the name of the class and to begin writing a file. To finish the class, write 'end Facility_Name;'",
    "Facility_Finalization" : "",
    "Facility_Initialization" : "",
    "false" : "",
    "Family" : "",
    "finalization" : "",
    "for all" : "For every circumstance like this, truth will be assumed.",
    "from" : "",
    "for" : "",
    "For" : "",
    "Forget" : "",
    "generalization" : "",
    "iff" : "This is used like an 'If and only if' statement from other programming languages.",
    "if" : "An If-Then-Else statement is like most other programming languages in that we are testing a condition for truth and then moving into whichever statement sequence depending on the outcome of the if statement.",
    "If" : "An If-Then-Else statement is like most other programming languages in that we are testing a condition for truth and then moving into whichever statement sequence depending on the outcome of the if statement.",
    "Implicit" : "",
    "implies" : "",
    "Inductive" : "",
    "Inductive_case" : "",
    "initialization" : "",
    "initialization ensures" : "whenever something is declared, the client is guaranteed this statement as its initial value.",
    "instantiation" : "",
    "intersection" : "",
    "introduces" : "",
    "is" : "",
    "is_in" : "",
    "Is_Initial" : "",
    "is_not_in" : "",
    "is_not_proper_subset_of" : "",
    "is_not_subet_of" : "",
    "is_not_substring_of" : "",
    "is_proper_subset_of" : "",
    "is_subset_of" : "",
    "is_substring_of" : "",
    "Iterate" : "",
    "lambda" : "The empty string.",
    "Lemma" : "",
    "Local" : "",
    "maintaining" : "This clause describes essentially what makes the loop work. It must be true at the beginning and at the end of every iteration of the loop.",
    "Math" : "",
    "middle" : "",
    "mod" : "",
    "modeled" : "",
    "modus" : "",
    "not" : "",
    "o" : "This connects the first and second parameters into a chain of the same type. Parentheses are mandatory around Concatenation expressions.",
    "of" : "",
    "oper" : "The beginning of a function within a class. This statement needs to be concluded with an 'end Operation_Name;'. This is used to declare the facility.",
    "Oper" : "The beginning of a function within a class. This statement needs to be concluded with an 'end Operation_Name;'. This is used to declare the facility.",
    "operation" : "The beginning of a function within a class. This statement needs to be concluded with an 'end Operation_Name;'. This is used to declare the facility.",
    "Operation" : "The beginning of a function within a class. This statement needs to be concluded with an 'end Operation_Name;'. This is used to declare the facility.",
    "or" : "",
    "otherwise" : "",
    "ponens" : "",
    "Powerset" : "",
    "powerset" : "",
    "preserves" : "The value passed in will always be the same ending value,  and we are guaranteed that the value will not be changed throughout the operation.",
    "pres" : "The value passed in will always be the same ending value,  and we are guaranteed that the value will not be changed throughout the operation.",
    "Presume" : "",
    "Proc" : "This contains implementation statements within a facility.",
    "Procedure" : "This contains implementation statements within a facility.",
    "Proof" : "",
    "proof" : "",
    "Proofs_for" : "",
    "Property" : "",
    "Pty" : "",
    "QED" : "",
    "quantifier" : "",
    "realization" : "This will contain code for a procedure from the Enhancement.",
    "Realization" : "This will contain code for a procedure from the Enhancement.",
    "realized" : "",
    "reassigns" : "",
    "Record" : "",
    "Recursive" : "",
    "reductio" : "",
    "related" : "",
    "rem" : "",
    "Remember" : "",
    "repeat" : "",
    "replaces" : "The value passed in becomes irrelevant and will be replaced by the value specified in the ensures clause by the end of the operation.",
    "rpl" : "The value passed in becomes irrelevant and will be replaced by the value specified in the ensures clause by the end of the operation.",
    "represented" : "",
    "requires" : "This clause is the pre-condition that the Client (or caller) is responsible for ensuring truth.",
    "res" : "",
    "restores" : "The value passed in will always be the same ending value, but there is no guarantee that it will not be changed throughout the operation.",
    "rest" : "The value passed in will always be the same ending value, but there is no guarantee that it will not be changed throughout the operation.",
    "rules" : "",
    "SSet" : "",
    "Static" : "",
    "Subtype" : "",
    "such" : "",
    "Supposition" : "",
    "that" : "",
    "then" : "",
    "Theorem" : "",
    "Theory" : "",
    "Precis" : "",
    "There" : "",
    "there" : "",
    "times" : "",
    "true" : "",
    "Type" : "",
    "type" : "",
    "Type_Family" : "",
    "union" : "The set of elements that are in the two sets.",
    "Unique" : "",
    "unique" : "",
    "Unit" : "",
    "unit" : "",
    "universal" : "",
    "updates" : "The value passed in will have a purposeful change at the end of the operation.",
    "upd" : "The value passed in will have a purposeful change at the end of the operation.",
    "uses" : "This allows RESOLVE to handle specific data types which are defined through the concepts listed in these clauses. This is similar to header files from other programming languages.",
    "Variable" : "The declaration of a variable always begins with this. The syntax is as follows: 'Var varname:   Vartype;'. The 'Vartype' is where you determine what kind of variable we are declaring.",
    "Var" : "The declaration of a variable always begins with this. The syntax is as follows: 'Var varname:   Vartype;'. The 'Vartype' is where you determine what kind of variable we are declaring.",
    "Variables" : "The declaration of a variable always begins with this. The syntax is as follows: 'Var varname:   Vartype;'. The 'Vartype' is where you determine what kind of variable we are declaring.",
    "Vars" : "The declaration of a variable always begins with this. The syntax is as follows: 'Var varname:   Vartype;'. The 'Vartype' is where you determine what kind of variable we are declaring.",
    "when" : "",
    "where" : "",
    "While" : "The beginning of a loop where the clause following this is what the loop will be ensuring is true to be able to continue on.",
    "without" : ""
});

function checkResolveKeywords(value) {
    if (keywordsTable.hasKeyword(value) > 0) {
        return true;
    }

    return false;
}

function showKeywordTooltip(pos, editor, textRange) {
    var selectedWord = editor.session.getTextRange(textRange);
    if (keywordsTable.hasKeyword(selectedWord) && keywordsTable.getTip(selectedWord) !== "") {
        var keyword = $("#code_editor").find(".ace_keyword:contains(" + selectedWord + ")");

        var length = selectedWord.length;
        keyword.each(function () {
            var offset = $(this).offset();
            var keywordPos = editor.renderer.screenToTextCoordinates(offset.left + 3, offset.top + 3);
            if (keywordPos.row == pos.row) {
                if (keywordPos.column <= pos.column && pos.column <= keywordPos.column + length) {
                    $(this).qtip({
                        content: {
                            text: keywordsTable.getTip(selectedWord),
                            title: {
                                text: selectedWord,
                                button: true
                            }
                        },
                        show: {
                            event: false, // Only show when show() is called manually
                            ready: true // Also show on page load
                        },
                        hide: "unfocus",
                        style: {
                            classes: "ui-tooltip-keywords ui-tooltip-rounded",
                            tip: {
                                corner: "top left"
                            }
                        }
                    });
                }
            }
        });
    }
}
