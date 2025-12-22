// Package funcpara reference https://git.woa.com/standards/go#61-%E6%8E%A8%E8%8D%90%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0
package funcpara

import (
	"fmt"
	"go/ast"
	"unicode"
	"unicode/utf8"

	"golang.org/x/tools/go/analysis"
)

// Analyzer 实现检查函数参数是否为小写开头
var Analyzer = analysis.Analyzer{
	Name: "tencentlint_funcpara",
	Doc:  "function paramters and result parameters should be start with lowercase",
	Run: func(pass *analysis.Pass) (interface{}, error) {
		for _, file := range pass.Files {
			ast.Inspect(file, func(node ast.Node) bool {
				f, ok := node.(*ast.FuncType)
				if !ok {
					return true
				}
				for _, field := range f.Params.List {
					checkFieldName(pass, field)
				}
				if f.Results != nil {
					for _, field := range f.Results.List {
						checkFieldName(pass, field)
					}
				}
				return true
			})
		}
		return nil, nil
	},
	RunDespiteErrors: true,
}

func checkFieldName(pass *analysis.Pass, f *ast.Field) {
	for _, name := range f.Names {
		if name.Name == "_" {
			continue
		}
		firstRune, _ := utf8.DecodeRuneInString(name.Name)
		if unicode.IsLower(firstRune) {
			continue
		}
		pass.Report(analysis.Diagnostic{
			Pos:     name.Pos(),
			End:     name.End(),
			Message: fmt.Sprintf("%s should start with lowercase", name.Name),
		})
	}
}
