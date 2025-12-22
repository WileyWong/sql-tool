package funcpara

import (
	"testing"

	"golang.org/x/tools/go/analysis/analysistest"
)

func TestFuncPara(t *testing.T) {
	analysistest.Run(t, analysistest.TestData(), &Analyzer)
}
