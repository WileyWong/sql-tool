// Package main provides a wrapper around golangci-lint to run it with a standard configuration.
package main

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
)

// language=gotemplate
const customGclTemplate = `version: {{.GolangCILintVersion}}
plugins:
  - module: '{{.Module}}/tencentlint'
    #import: 'git.woa.com/standards/go/tencentlint'
    import: '{{.Module}}/tencentlint'
	{{- if .PluginPath}}
    path: '{{.PluginPath}}'
    {{- else}}
    version: '{{.Version}}'
    {{- end}}
`

var customGclTemplateData = template.Must(template.New("customGclTemplate").Parse(customGclTemplate))

const (
	defaultStandardsRepo = "git.woa.com/standards/go"
	goProxyURL           = "https://goproxy.woa.com/"
)

func prepareStandardConfig(repo, version, workdir string) error {
	versionURL := fmt.Sprintf("%s%s/@latest", goProxyURL, repo)
	if version != "" && version != "latest" {
		versionURL = fmt.Sprintf("%s%s/@v/%s.info", goProxyURL, repo, version)
	}
	latestResponse, err := http.Get(versionURL)
	if err != nil {
		return err
	}
	defer func() { _ = latestResponse.Body.Close() }()
	var versionInfo struct {
		Version string
		Time    string
	}
	if err = json.NewDecoder(latestResponse.Body).Decode(&versionInfo); err != nil {
		return err
	}
	zipResponse, err := http.Get(fmt.Sprintf("%s%s/@v/%s.zip", goProxyURL, repo, versionInfo.Version))
	if err != nil {
		return err
	}
	defer func() { _ = zipResponse.Body.Close() }()
	zipData, err := io.ReadAll(zipResponse.Body)
	if err != nil {
		return err
	}
	zipReader, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil {
		return err
	}
	configFile, err := zipReader.Open(fmt.Sprintf("%s@%s/.golangci.yml", repo, versionInfo.Version))
	if err != nil {
		return err
	}
	defer func() { _ = configFile.Close() }()
	outFile, err := os.Create(filepath.Join(workdir, ".golangci.yml"))
	if err != nil {
		return err
	}
	defer func() { _ = outFile.Close() }()
	_, err = io.Copy(outFile, configFile)
	if err != nil {
		return err
	}
	return nil
}

func buildCustomGcl(workdir string, verbose bool) error {
	args := []string{"run", "github.com/golangci/golangci-lint/cmd/golangci-lint@v1.64.8", "custom"}
	if verbose {
		args = append(args, "-v")
	}
	cmd := exec.Command("go", args...)
	cmd.Dir = workdir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func runLint(workdir string, verbose bool, extraArgs []string) error {
	executable := filepath.Join(workdir, "custom-gcl")
	args := []string{"-c", filepath.Join(workdir, ".golangci.yml")}
	if verbose {
		args = append(args, "-v")
	}
	if len(extraArgs) == 0 {
		args = append(args, "run")
	} else {
		args = append(args, extraArgs...)
	}
	cmd := exec.Command(executable, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func main() {
	defer func() {
		if p := recover(); p != nil {
			_, _ = fmt.Fprintf(os.Stderr, "panic: %v\n", p)
			os.Exit(1)
		}
	}()
	configVersion := flag.String("config-version", "master", fmt.Sprintf("config version see %s", defaultStandardsRepo))
	standardsRepo := flag.String("standards-repo", defaultStandardsRepo, "standards repository")
	lintVersion := flag.String("lint-version", "v1.64.8", "golangci-lint version")
	pluginPath := flag.String("plugin-path", "", "plugin path in local (for dev)")
	verbose := flag.Bool("verbose", false, "print verbose output")
	flag.Parse()
	if *pluginPath != "" {
		var err error
		*pluginPath, err = filepath.Abs(*pluginPath)
		if err != nil {
			panic(fmt.Errorf("failed to get absolute path for plugin with error %w", err))
		}
	}

	dir, err := os.MkdirTemp("", "")
	if err != nil {
		panic(fmt.Errorf("failed to create temp dir with error %w", err))
	}
	defer func() { _ = os.RemoveAll(dir) }()
	customGclFile, err := os.Create(filepath.Join(dir, ".custom-gcl.yml"))
	if err != nil {
		panic(fmt.Errorf("failed to create custom gcl file with error %w", err))
	}
	if err = customGclTemplateData.Execute(customGclFile, map[string]string{
		"Version":             *configVersion,
		"Module":              *standardsRepo,
		"GolangCILintVersion": *lintVersion,
		"PluginPath":          *pluginPath,
	}); err != nil {
		panic(fmt.Errorf("failed to write custom gcl file with error %w", err))
	}
	if err = customGclFile.Close(); err != nil {
		panic(fmt.Errorf("failed to close custom gcl file with error %w", err))
	}
	if err = buildCustomGcl(dir, *verbose); err != nil {
		panic(fmt.Errorf("failed to build custom gcl with error %w", err))
	}
	if err = prepareStandardConfig(*standardsRepo, *configVersion, dir); err != nil {
		panic(fmt.Errorf("failed to prepare config with error %w", err))
	}
	if err = runLint(dir, *verbose, flag.Args()); err != nil {
		panic(fmt.Errorf("failed to run lint with error %w", err))
	}
}
