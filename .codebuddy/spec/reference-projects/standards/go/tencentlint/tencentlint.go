// Package tencentlint provides lints for Tencent Go code.
package tencentlint

import (
	"github.com/golangci/plugin-module-register/register"
	"golang.org/x/tools/go/analysis"

	"git.woa.com/standards/go/tencentlint/funcpara"
)

func init() {
	register.Plugin("tencentlint", New)
}

type analyzerPlugin struct{}

func (p analyzerPlugin) BuildAnalyzers() ([]*analysis.Analyzer, error) {
	return []*analysis.Analyzer{
		&funcpara.Analyzer,
	}, nil
}

func (p analyzerPlugin) GetLoadMode() string {
	return register.LoadModeSyntax
}

func (analyzerPlugin) GetAnalyzers() []*analysis.Analyzer {
	return []*analysis.Analyzer{
		&funcpara.Analyzer,
	}
}

// New creates all plugins
func New(conf any) (register.LinterPlugin, error) {
	return analyzerPlugin{}, nil
}
