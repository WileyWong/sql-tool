### Run Go Fuzz Tests and Execute Baseline

Source: https://go.dev/doc/tutorial/fuzz

Demonstrates the commands to run Go tests, both with and without fuzzing enabled. It shows how to execute a specific fuzz test and provides an example of baseline test execution.

```bash
$ go test
PASS
ok      example/fuzz  0.013s

```

```bash
$ go test -run=FuzzReverse
```

```bash
$ go test -fuzz=Fuzz
```

```bash
$ go test -fuzz=Fuzz -fuzztime 10s
```

--------------------------------

### Run Go Tests and Fuzzing Commands

Source: https://go.dev/doc/tutorial/fuzz

This section shows the command-line execution of Go tests and fuzzing. It includes examples for running standard tests (`go test`), initiating fuzzing (`go test -fuzz=Fuzz`), and running fuzzing for a specified duration (`go test -fuzz=Fuzz -fuzztime 30s`). The output demonstrates successful test runs and fuzzing sessions.

```bash
$ go test
PASS
ok      example/fuzz  0.019s
```

```bash
$ go test -fuzz=Fuzz
fuzz: elapsed: 0s, gathering baseline coverage: 0/38 completed
fuzz: elapsed: 0s, gathering baseline coverage: 38/38 completed, now fuzzing with 4 workers
fuzz: elapsed: 3s, execs: 86342 (28778/sec), new interesting: 2 (total: 35)
fuzz: elapsed: 6s, execs: 193490 (35714/sec), new interesting: 4 (total: 37)
fuzz: elapsed: 9s, execs: 304390 (36961/sec), new interesting: 4 (total: 37)
...
fuzz: elapsed: 3m45s, execs: 7246222 (32357/sec), new interesting: 8 (total: 41)
^Cfuzz: elapsed: 3m48s, execs: 7335316 (31648/sec), new interesting: 8 (total: 41)
PASS
ok      example/fuzz  228.000s
```

```bash
$ go test -fuzz=Fuzz -fuzztime 30s
fuzz: elapsed: 0s, gathering baseline coverage: 0/5 completed
fuzz: elapsed: 0s, gathering baseline coverage: 5/5 completed, now fuzzing with 4 workers
fuzz: elapsed: 3s, execs: 80290 (26763/sec), new interesting: 12 (total: 12)
fuzz: elapsed: 6s, execs: 210803 (43501/sec), new interesting: 14 (total: 14)
fuzz: elapsed: 9s, execs: 292882 (27360/sec), new interesting: 14 (total: 14)
fuzz: elapsed: 12s, execs: 371872 (26329/sec), new interesting: 14 (total: 14)
fuzz: elapsed: 15s, execs: 517169 (48433/sec), new interesting: 15 (total: 15)
fuzz: elapsed: 18s, execs: 663276 (48699/sec), new interesting: 15 (total: 15)
fuzz: elapsed: 21s, execs: 771698 (36143/sec), new interesting: 15 (total: 15)
fuzz: elapsed: 24s, execs: 924768 (50990/sec), new interesting: 16 (total: 16)
fuzz: elapsed: 27s, execs: 1082025 (52427/sec), new interesting: 17 (total: 17)
fuzz: elapsed: 30s, execs: 1172817 (30281/sec), new interesting: 17 (total: 17)
fuzz: elapsed: 31s, execs: 1172817 (0/sec), new interesting: 17 (total: 17)
PASS
ok      example/fuzz  31.025s
```

--------------------------------

### Display Go Help

Source: https://go.dev/doc/tutorial/getting-started

This command displays a list of available 'go' commands, providing an overview of the tools and functionalities offered by the Go toolchain.

```bash
go help
```

--------------------------------

### Automated Go Contributor Initialization

Source: https://go.dev/doc/contribute

Automates the initial setup for Go project contributions, including essential steps like CLA signing and environment configuration. It requires the `go-contrib-init` tool to be installed and then executed within the project's code directory.

```bash
go install golang.org/x/tools/cmd/go-contrib-init@latest
cd /code/to/edit
go-contrib-init

```

--------------------------------

### Clone golang.org/x/example/hello Repository

Source: https://go.dev/doc/tutorial/workspaces

Clones the Git repository for the golang.org/x/example module. This is the initial step to obtain the source code for modification. It requires Git to be installed and accessible in the system's PATH.

```bash
$ git clone https://go.googlesource.com/example
Cloning into 'example'...
remote: Total 165 (delta 27), reused 165 (delta 27)
Receiving objects: 100% (165/165), 434.18 KiB | 1022.00 KiB/s, done.
Resolving deltas: 100% (27/27), done.

```

--------------------------------

### Initialize Go Module

Source: https://go.dev/doc/tutorial/getting-started

This command initializes a new Go module, creating a go.mod file to manage dependencies for the project. The module path 'example/hello' is used for this tutorial.

```bash
go mod init example/hello
go: creating new go.mod: module example/hello
```

--------------------------------

### Go Web Server: Main Function and HTTP Setup

Source: https://go.dev/doc/articles/wiki/part3_m=text

The main function sets up the HTTP server, registering handlers for different URL paths and starting the listener on port 8080. It uses 'net/http' for routing.

```go
func main() {
	http.HandleFunc("/view/", viewHandler)
	http.HandleFunc("/edit/", editHandler)
	//http.HandleFunc("/save/", saveHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

--------------------------------

### Run Go Program

Source: https://go.dev/doc/tutorial/getting-started

This command compiles and runs the Go program in the current directory. It's used here to execute the 'Hello, World!' program and display its output.

```bash
go run .
Hello, World!
```

--------------------------------

### Create and Navigate to Go Project Directory

Source: https://go.dev/doc/tutorial/getting-started

These commands create a new directory named 'hello' for the Go project and then change the current directory into the newly created 'hello' directory. This sets up the workspace for the Go code.

```bash
mkdir hello
cd hello
```

--------------------------------

### Install git-codereview Tool

Source: https://go.dev/doc/contribute

Installs the `git-codereview` tool, which is used for submitting changes to the Go project's Gerrit instance. This command uses `go install` and requires the Go toolchain to be set up.

```bash
go install golang.org/x/review/git-codereview@latest
```

--------------------------------

### Execute Go Program with External Package

Source: https://go.dev/doc/tutorial/getting-started

Illustrates how to run a Go program that calls an external package function. The output shows the message generated by the `quote.Go()` function.

```bash
$ go run .
Don't communicate by sharing memory, share memory by communicating.
```

--------------------------------

### Go Package Comment Example

Source: https://go.dev/doc/comment

This example demonstrates a Go package comment. Package comments introduce the package, provide an overview, and can include links to other documentation. The first sentence should start with 'Package '.

```go
// Package path implements utility routines for manipulating slash-separated
// paths.
//
// The path package should only be used for paths separated by forward
// slashes, such as the paths in URLs. This package does not deal with
// Windows paths with drive letters or backslashes; to manipulate
// operating system paths, use the [path/filepath] package.
package path

```

--------------------------------

### Hello World Program in Go

Source: https://go.dev/doc/tutorial/getting-started

A basic 'Hello, World!' program written in Go. It declares the main package, imports the 'fmt' package for printing, and defines a main function that prints the message to the console.

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

--------------------------------

### Navigate to Home Directory (Linux/Mac)

Source: https://go.dev/doc/tutorial/getting-started

This command changes the current directory to the user's home directory on Linux and macOS operating systems. It's a prerequisite for creating new project directories.

```bash
cd
```

--------------------------------

### Go: Main HTTP Server Setup

Source: https://go.dev/doc/articles/wiki/final_m=text

Sets up the main HTTP server for the wiki application. It registers handlers for different URL paths using `http.HandleFunc` and starts the server on port 8080 using `http.ListenAndServe`. Errors during server startup are logged using `log.Fatal`.

```Go
func main() {
	http.HandleFunc("/view/", makeHandler(viewHandler))
	http.HandleFunc("/edit/", makeHandler(editHandler))
	http.HandleFunc("/save/", makeHandler(saveHandler))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

--------------------------------

### Install git-codereview command (Go)

Source: https://go.dev/doc/contribute

Installs the 'git-codereview' command-line tool, which simplifies submitting code changes to Gerrit for review. Ensure your Go environment is set up and GOPATH/bin is in your system's PATH.

```go
$ go install golang.org/x/review/git-codereview@latest

```

--------------------------------

### Import and Call External Go Package

Source: https://go.dev/doc/tutorial/getting-started

Demonstrates importing the `rsc.io/quote` package and calling its `Go` function within a Go program. This allows the program to utilize external functionality for generating messages.

```go
package main

import "fmt"

import "rsc.io/quote"

func main() {
    fmt.Println(quote.Go())
}
```

--------------------------------

### Navigate to Home Directory (Windows)

Source: https://go.dev/doc/tutorial/getting-started

This command changes the current directory to the user's home directory on Windows operating systems using the HOMEPATH environment variable. It's a prerequisite for creating new project directories.

```bash
cd %HOMEPATH%
```

--------------------------------

### Create and run a simple Go program

Source: https://go.dev/doc/install/source

Demonstrates how to create a basic 'hello, world' program in Go and execute it using the 'go run' command. This is used to verify a successful Go installation.

```go
package main

import "fmt"

func main() {
	fmt.Printf("hello, world\n")
}
```

```bash
$ go run hello.go
```

--------------------------------

### Install Go Packages with 'go get'

Source: https://go.dev/doc/articles/go_command

This command installs specified Go packages and their dependencies into the default GOPATH. It downloads source code and compiles packages.

```bash
$ go get github.com/google/codesearch/index
$ go get github.com/petar/GoLLRB/llrb
$ 
```

--------------------------------

### Manage Go Module Dependencies

Source: https://go.dev/doc/tutorial/getting-started

Shows the command `go mod tidy` used to automatically add necessary module requirements and update checksums for authenticated module usage. It also displays the output indicating the found module and version.

```bash
$ go mod tidy
go: finding module for package rsc.io/quote
go: found rsc.io/quote in rsc.io/quote v1.5.2
```

--------------------------------

### Alternative Variable Declaration in Go

Source: https://go.dev/doc/tutorial/create-module

Demonstrates the long-form way to declare and initialize a string variable in Go using the 'var' keyword, contrasted with the shorter ':= ' operator shown in the main example. This is useful for understanding Go's variable declaration syntax.

```go
var message string
message = fmt.Sprintf("Hi, %v. Welcome!", name)
```

--------------------------------

### Build and Install a Go Program

Source: https://go.dev/doc/code

Builds and installs a Go program, creating an executable binary. The installation location depends on `GOPATH` and `GOBIN` environment variables. This command is essential for deploying Go applications.

```bash
go install example/user/hello
```

--------------------------------

### Install Go Tour Tool

Source: https://go.dev/doc/index

This command installs the Go Tour tool, an interactive introduction to Go. The tool is placed in your GOPATH's bin directory after successful installation.

```bash
go install golang.org/x/website/tour@latest
```

--------------------------------

### Verify git-codereview installation (Shell)

Source: https://go.dev/doc/contribute

Verifies that the 'git-codereview' command is installed and accessible in your shell's PATH. If it returns an error, you may need to add '$GOPATH/bin' to your system's PATH environment variable.

```shell
$ git codereview help

```

--------------------------------

### Go Workspace File Configuration

Source: https://go.dev/doc/tutorial/workspaces

Illustrates the content of a go.work file after adding a module. It specifies the Go version and lists the modules included in the workspace, enabling local development and testing across multiple modules.

```go
go 1.18

use (
    ./hello
    ./example/hello
)

```

--------------------------------

### Initializing and Committing a Git Repository

Source: https://go.dev/doc/modules/managing-source

This example demonstrates the basic Git commands for initializing a new repository, staging all current files for commit, and making the initial commit with a message. It's a common pattern for starting new Go modules or projects.

```bash
$ git init
$ git add --all
$ git commit -m "mycode: initial commit"
$ git push
```

--------------------------------

### Create a Greeting Function in Go

Source: https://go.dev/doc/tutorial/create-module

Defines a simple Go function named 'Hello' within the 'greetings' package. This function takes a name (string) as input and returns a personalized greeting string. It utilizes the 'fmt' package for string formatting. Functions starting with a capital letter are exported and can be called from other packages.

```go
package greetings

import "fmt"

// Hello returns a greeting for the named person.
func Hello(name string) string {
    // Return a greeting that embeds the name in a message.
    message := fmt.Sprintf("Hi, %v. Welcome!", name)
    return message
}
```

--------------------------------

### Build gccgo from Source

Source: https://go.dev/doc/install/gccgo

Clones the gccgo repository, creates a build directory, configures the build with specified languages and linker, and then compiles and installs gccgo. Assumes prerequisites are met.

```bash
git clone --branch devel/gccgo git://gcc.gnu.org/git/gcc.git gccgo
mkdir objdir
cd objdir
../gccgo/configure --prefix=/opt/gccgo --enable-languages=c,c++,go --with-ld=/opt/gold/bin/ld
make
make install
```

--------------------------------

### Install Go Application using `go install`

Source: https://go.dev/doc/tutorial/compile-install

Compiles and installs a Go package into the designated binary directory. This makes the executable available system-wide.

```bash
$ go install
```

--------------------------------

### Run Go Program

Source: https://go.dev/doc/tutorial/workspaces

Executes a Go program from the current directory. This command compiles and runs the main package found in the current directory. Ensure all dependencies are met before running.

```bash
go run .
olleH
```

--------------------------------

### Run Go Program

Source: https://go.dev/doc/tutorial/fuzz

Executes a Go program file named main.go. This command compiles and runs the specified Go source file. It's used here to demonstrate the output of the string reversal function.

```bash
go run .
original: "The quick brown fox jumped over the lazy dog"
reversed: "god yzal eht revo depmuj xof nworb kciuq ehT"
reversed again: "The quick brown fox jumped over the lazy dog"
```

--------------------------------

### Initialize Go Module and Create Main File

Source: https://go.dev/doc/tutorial/govulncheck

Initializes a new Go module and creates a main.go file with sample code. This sets up the project structure for the tutorial. It requires Go to be installed.

```bash
$ mkdir vuln-tutorial
$ cd vuln-tutorial
$ go mod init vuln.tutorial

```

```go
package main

import (
        "fmt"
        "os"

        "golang.org/x/text/language"
)

func main() {
        for _, arg := range os.Args[1:] {
                tag, err := language.Parse(arg)
                if err != nil {
                        fmt.Printf("%s: error: %v\n", arg, err)
                } else if tag == language.Und {
                        fmt.Printf("%s: undefined\n", arg)
                } else {
                        fmt.Printf("%s: tag %s\n", arg, tag)
                }
        }
}

```

--------------------------------

### Initialize a Go Module with 'go mod init'

Source: https://go.dev/doc/tutorial/create-module

Initializes a new Go module in the current directory. This command creates a 'go.mod' file, which tracks the module's path and Go version, and will later list its dependencies. It's essential for managing code that others can use.

```bash
$ go mod init example.com/greetings
go: creating new go.mod: module example.com/greetings
```

--------------------------------

### Modify Main Function for Error Handling in Go

Source: https://go.dev/doc/tutorial/fuzz

This Go main function demonstrates how to call the `Reverse` function and handle its potential error return. It calls `Reverse` twice and prints the original string, the reversed string, and any errors encountered. This example is crucial for understanding how to integrate the UTF-8 validated `Reverse` function into an application.

```go
import (
    "fmt"
    "unicode/utf8"
    "errors"
)

func main() {
    input := "The quick brown fox jumped over the lazy dog"
    rev, revErr := Reverse(input)
    doubleRev, doubleRevErr := Reverse(rev)
    fmt.Printf("original: %q\n", input)
    fmt.Printf("reversed: %q, err: %v\n", rev, revErr)
    fmt.Printf("reversed again: %q, err: %v\n", doubleRev, doubleRevErr)
}
```

--------------------------------

### Verify Go Installation (Linux/Mac/Windows)

Source: https://go.dev/doc/install

This command checks if Go has been installed correctly by displaying the installed version. If the installation was successful, it will print the version number.

```bash
$ go version
```

--------------------------------

### Go String Reversal Function

Source: https://go.dev/doc/tutorial/fuzz

A Go function that reverses a UTF-8 valid string. It checks for UTF-8 validity and returns an error if the input is invalid. This function is used in the fuzzing example.

```go
package main

import (
    "errors"
    "fmt"
    "unicode/utf8"
)

func main() {
    input := "The quick brown fox jumped over the lazy dog"
    rev, revErr := Reverse(input)
    doubleRev, doubleRevErr := Reverse(rev)
    fmt.Printf("original: %q\n", input)
    fmt.Printf("reversed: %q, err: %v\n", rev, revErr)
    fmt.Printf("reversed again: %q, err: %v\n", doubleRev, doubleRevErr)
}

func Reverse(s string) (string, error) {
    if !utf8.ValidString(s) {
        return s, errors.New("input is not valid UTF-8")
    }
    r := []rune(s)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r), nil
}

```

--------------------------------

### Install Go tools (gopls) using go install

Source: https://go.dev/doc/install/source

Installs a specific Go tool, such as 'gopls', from the golang.org/x/tools repository. The '@latest' tag ensures the most recent version is installed.

```bash
$ go install golang.org/x/tools/gopls@latest
```

--------------------------------

### Update Module Dependency with go get

Source: https://go.dev/doc/tutorial/workspaces

Updates a module's dependency to a specific version, in this case, `golang.org/x/example/hello@v0.1.0`. This command is used after a module has been released and tagged, allowing other projects to consume the released version instead of a local development version.

```bash
cd hello
go get golang.org/x/example/hello@v0.1.0

```

--------------------------------

### Retrieve All Albums via Curl GET Request

Source: https://go.dev/doc/tutorial/web-service-gin

Example of using curl to make a GET request to retrieve the full list of albums from the running Go web service. It specifies the URL and headers.

```shell
$ curl http://localhost:8080/albums \
    --header "Content-Type: application/json" \
    --request "GET"
```

--------------------------------

### Bootstrap Go Toolchain using GCCGo

Source: https://go.dev/doc/install/source

This method utilizes gccgo as the bootstrap toolchain. It requires installing gccgo, setting the 'go' alternative to use the gccgo version, and then building Go from source. This is an alternative for users who prefer or have access to gccgo.

```bash
$ sudo apt-get install gccgo-5
$ sudo update-alternatives --set go /usr/bin/go-5
$ GOROOT_BOOTSTRAP=/usr ./make.bash

```

--------------------------------

### PPC64 Assembly: Architecture Support

Source: https://go.dev/doc/asm

Indicates that the assembler supports GOARCH values ppc64 and ppc64le. No specific code examples are provided in this section, but it references the Go PPC64 Assembly Instructions Reference Manual.

--------------------------------

### Configure Gin Router for GET and POST

Source: https://go.dev/doc/tutorial/web-service-gin

This Go code snippet configures a Gin router in the main function. It sets up handlers for GET and POST requests to the /albums path and starts the HTTP server on localhost:8080.

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.POST("/albums", postAlbums)

    router.Run("localhost:8080")
}

```

--------------------------------

### Initialize Go Module

Source: https://go.dev/doc/tutorial/fuzz

Initializes a new Go module in the specified directory. This command creates a go.mod file to manage dependencies. It's a prerequisite for running Go commands like build, test, and fuzz.

```bash
go mod init example/fuzz
go: creating new go.mod: module example/fuzz
```

--------------------------------

### Install and Download a Specific Go Version (Go)

Source: https://go.dev/doc/manage-install

This snippet demonstrates how to install a specific version of Go using the `go install` command and then download it. It's useful for testing code against different Go versions. Requires `git` to be installed.

```bash
$ go install golang.org/dl/go1.10.7@latest
$ go1.10.7 download
```

--------------------------------

### Build gold linker with GCC

Source: https://go.dev/doc/install/gccgo

Instructions to build the gold linker from source, a prerequisite for enabling certain features in gccgo. This process involves cloning the binutils-gdb repository, configuring with specific options, and then building and installing the linker.

```shell
git clone git://sourceware.org/git/binutils-gdb.git
mkdir binutils-objdir
cd binutils-objdir
../binutils-gdb/configure --enable-gold=default --prefix=/opt/gold
make
make install

```

--------------------------------

### Install govulncheck

Source: https://go.dev/doc/tutorial/govulncheck

Installs the govulncheck tool to the latest version using the 'go install' command. This is a prerequisite for running vulnerability scans on Go projects.

```bash
$ go install golang.org/x/vuln/cmd/govulncheck@latest

```

--------------------------------

### Go Main Function for String Reversal Demo

Source: https://go.dev/doc/tutorial/fuzz

Demonstrates the usage of the Reverse function by reversing a string twice and printing the original and reversed versions. This helps to verify the function's behavior and see it in action before fuzzing.

```go
package main

import "fmt"

func main() {
    input := "The quick brown fox jumped over the lazy dog"
    rev := Reverse(input)
    doubleRev := Reverse(rev)
    fmt.Printf("original: %q\n", input)
    fmt.Printf("reversed: %q\n", rev)
    fmt.Printf("reversed again: %q\n", doubleRev)
}
```

--------------------------------

### Bootstrap Go Toolchain using Binary Release

Source: https://go.dev/doc/install/source

This method involves downloading a pre-compiled Go binary release to use as a bootstrap toolchain. This is a straightforward approach for users who meet the minimum version requirements for building the desired Go version.

```text
Download a recent binary release of Go.
```

--------------------------------

### Using a Custom Go Package in the Main Application

Source: https://go.dev/doc/code

Illustrates how to import and use the custom 'morestrings' package within the main 'hello' program. The 'go install' command is used to build and install the program.

```go
package main

import (
    "fmt"

    "example/user/hello/morestrings"
)

func main() {
    fmt.Println(morestrings.ReverseRunes("!oG ,olleH"))
}
```

```bash
go install example/user/hello
```

--------------------------------

### Initialize Go Module

Source: https://go.dev/doc/tutorial/workspaces

Initializes a new Go module in the specified directory. This command creates a go.mod file, which is essential for managing dependencies and module information. It requires a module path as an argument.

```bash
mkdir hello
cd hello
go mod init example.com/hello
go: creating new go.mod: module example.com/hello
```

--------------------------------

### Add Go Module Dependency

Source: https://go.dev/doc/tutorial/workspaces

Adds a dependency on a specified Go package to the current module. The 'go get' command downloads the package and updates the go.mod file. It's crucial for managing external libraries.

```bash
go get golang.org/x/example/hello/reverse
```

--------------------------------

### Run Installed Go Application

Source: https://go.dev/doc/tutorial/compile-install

Executes an installed Go application by simply typing its name. This assumes the installation directory has been added to the system's PATH.

```bash
$ hello
```

--------------------------------

### Create Go Wiki Directory and Navigate

Source: https://go.dev/doc/articles/wiki

This snippet demonstrates how to create a new directory for the Go wiki project and navigate into it using command-line instructions. It assumes a Unix-like environment with Go installed.

```bash
$ mkdir gowiki
$ cd gowiki
```

--------------------------------

### Build Go distribution using all.bash

Source: https://go.dev/doc/install/source

Compiles the Go distribution from source and runs extensive tests. This is the primary build command after fetching the repository and navigating to the 'src' directory. Use 'all.bat' on Windows.

```bash
$ cd src
$ ./all.bash
```

--------------------------------

### Go Package Import for Fuzz Testing

Source: https://go.dev/doc/tutorial/fuzz

This Go code snippet shows the necessary imports for a fuzz test, including the 'testing' package for test functionality and the 'unicode/utf8' package for UTF-8 string validation. This is typically placed at the top of a *_test.go file.

```go
package main

import (
    "testing"
    "unicode/utf8"
)
```

--------------------------------

### Calling C Function from Go (Example)

Source: https://go.dev/doc/install/gccgo

Provides an example of calling the declared C `open` function from Go. It shows how to create a NUL-terminated byte array in Go and pass its address to the C function.

```go
var name = [4]byte{'f', 'o', 'o', 0};
i := c_open(&name[0], syscall.O_RDONLY, 0);

```

--------------------------------

### Discover Go Install Path using `go list`

Source: https://go.dev/doc/tutorial/compile-install

Finds the target directory where the `go` command will install packages. This is useful for adding the directory to the system's PATH.

```bash
$ go list -f '{{.Target}}'
```

--------------------------------

### GitHub Issue Search Queries for Go Project

Source: https://go.dev/doc/contribute

Examples of GitHub search queries to find issues in the Go project based on labels like 'NeedsInvestigation' and 'NeedsFix'. These queries help identify tasks for potential contributors.

```text
is:issue is:open label:NeedsInvestigation
```

```text
is:issue is:open label:NeedsFix
```

```text
is:issue is:open label:NeedsFix ("golang.org/cl" OR "go.dev/cl")
```

```text
is:issue is:open label:NeedsFix NOT "golang.org/cl" NOT "go.dev/cl"
```

--------------------------------

### Update Go to Latest Release using Git

Source: https://go.dev/doc/install/source

This snippet outlines the steps to update an existing Go installation to the latest release. It involves navigating to the Go source directory, fetching the latest changes, checking out the specific release tag, and then running the all.bash script to complete the update. Ensure you replace '<tag>' with the actual release version.

```bash
$ cd go/src
$ git fetch
$ git checkout _<tag>_
$ ./all.bash
```

--------------------------------

### Initialize Go Workspace

Source: https://go.dev/doc/tutorial/workspaces

Initializes a multi-module workspace. This command creates a go.work file, which allows the Go toolchain to recognize multiple modules as main modules for building and development purposes. It takes paths to the modules as arguments.

```bash
go work init ./hello
```

--------------------------------

### Go Gin Main Function with Routing

Source: https://go.dev/doc/tutorial/web-service-gin

Sets up the main function for a Gin web server. It initializes a Gin router, defines a GET endpoint '/albums' that maps to the 'getAlbums' handler, and starts the server on localhost:8080.

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)

    router.Run("localhost:8080")
}

```

--------------------------------

### Create Go Program with Dependency

Source: https://go.dev/doc/tutorial/workspaces

Defines a Go program that utilizes a function from an external module. This snippet demonstrates how to import and use packages from dependencies within your Go code.

```go
package main

import (
    "fmt"

    "golang.org/x/example/hello/reverse"
)

func main() {
    fmt.Println(reverse.String("Hello"))
}
```

--------------------------------

### Go Type Documentation: Basic Structure

Source: https://go.dev/doc/comment

Illustrates the basic structure for documenting a Go type. The doc comment starts with a sentence naming the type and explaining its purpose. This example shows a simple reader for ZIP archives.

```go
package zip

// A Reader serves content from a ZIP archive.
type Reader struct {
    ...
}
```

--------------------------------

### Compile Go Application using `go build`

Source: https://go.dev/doc/tutorial/compile-install

Compiles Go source files into an executable binary. This command groups packages and their dependencies but does not install the result.

```bash
$ go build
```

--------------------------------

### Go Workspace File Structure

Source: https://go.dev/doc/tutorial/workspaces

Represents the content of a go.work file, which defines a multi-module workspace. The 'go' directive specifies the Go version, and 'use' directives list the modules included in the workspace.

```go
go 1.18

use ./hello
```

--------------------------------

### Retrieve Specific Album via Curl GET Request

Source: https://go.dev/doc/tutorial/web-service-gin

Example of using curl to make a GET request to retrieve a specific album by its ID from the running Go web service. It specifies the URL with the album ID.

```shell
$ curl http://localhost:8080/albums/2
```

--------------------------------

### Clone Go repository using Git

Source: https://go.dev/doc/install/source

Clones the official Go repository to a specified directory and checks out a release tag. This is a prerequisite for building Go from source. Ensure the target directory does not already exist.

```bash
$ git clone https://go.googlesource.com/go goroot
$ cd goroot
$ git checkout _<tag>_
```

--------------------------------

### Go Assembler Jump to Label Example

Source: https://go.dev/doc/asm

Demonstrates a basic jump to a label in Go assembly. This pattern is used for control flow within a function. Labels are local to their defining function.

```goasm
label:
	MOVW $0, R1
	JMP label

```

--------------------------------

### Go Identifier Syntax

Source: https://go.dev/doc/go_spec

Defines the structure of an identifier in Go, which must start with a letter and can be followed by letters or digits. Provides examples of valid identifiers.

```Go
identifier = letter { letter | unicode_digit } .

```

```Go
a
_x9
ThisVariableIsExported
αβ

```

--------------------------------

### Install Go Package in Current Directory with 'go install'

Source: https://go.dev/doc/articles/go_command

This command compiles and installs the package in the current directory, placing the compiled output in the 'pkg' directory. It recursively installs any outdated dependencies.

```bash
$ go install
$ 
```

--------------------------------

### Create a Simple Web Server with Go net/http

Source: https://go.dev/doc/articles/wiki

Demonstrates how to create a basic web server using Go's net/http package. It handles requests to the root path and logs any fatal errors during server operation. This example is suitable for beginners learning about Go web development.

```go
//go:build ignore

package main

import (
    "fmt"
    "log"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
}

func main() {
    http.HandleFunc("/", handler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}

```

--------------------------------

### Go Install: Forcing Dependency Installation

Source: https://go.dev/doc/go1

Explains the use of the '-i' flag with the 'go install' command. By default, 'go install' now only installs the explicitly listed packages. The '-i' flag is introduced to force the installation of all necessary dependencies, ensuring a complete build environment when needed, although this is generally not required due to the new build cache.

```go
go install -i cmd/gofmt
```

--------------------------------

### Go Package Import Example

Source: https://go.dev/doc/effective_go

Demonstrates how to import a Go package and access its contents using the package name as an accessor. This example shows importing the 'bytes' package.

```go
import "bytes"

// After importing, access contents like bytes.Buffer
```

--------------------------------

### Cross-Compile Go Toolchain using bootstrap.bash

Source: https://go.dev/doc/install/source

This script cross-compiles a Go toolchain for a specific GOOS/GOARCH combination from a system with a working Go installation. The resulting toolchain is saved in a separate directory and can be used as GOROOT_BOOTSTRAP on the target machine.

```bash
$ GOOS=linux GOARCH=ppc64 ./bootstrap.bash

```

--------------------------------

### Run Go Program in Workspace

Source: https://go.dev/doc/tutorial/workspaces

Executes a Go program located within a multi-module workspace. When run from the workspace directory, the Go command considers all modules defined in the go.work file, enabling cross-module references.

```bash
go run ./hello
olleH
```

--------------------------------

### Modify Main Program to Use New Reverse Function

Source: https://go.dev/doc/tutorial/workspaces

Updates the `main` function in `workspace/hello/hello.go` to utilize the newly added `Int` function from the `reverse` package. This demonstrates how to integrate custom logic from a local module into an application.

```go
package main

import (
    "fmt"

    "golang.org/x/example/hello/reverse"
)

func main() {
    fmt.Println(reverse.String("Hello"), reverse.Int(24601))
}

```

--------------------------------

### Go Module Example

Source: https://go.dev/doc/modules/gomod-ref

A comprehensive example of a go.mod file, showcasing various directives. It includes the module path declaration, the minimum Go version required, a list of module dependencies, and examples of replacing and excluding specific module versions.

```go
module example.com/mymodule

go 1.14

require (
    example.com/othermodule v1.2.3
    example.com/thismodule v1.2.3
    example.com/thatmodule v1.2.3
)

replace example.com/thatmodule => ../thatmodule
exclude example.com/thismodule v1.3.0
```

--------------------------------

### Re-running Go Fuzz Test with Failing Corpus Entry

Source: https://go.dev/doc/tutorial/fuzz

Shows how to run Go tests after a failure, where the failing input from the corpus is automatically used. This demonstrates that the failing condition will be reproduced without the -fuzz flag.

```bash
$ go test
--- FAIL: FuzzReverse (0.00s)
    --- FAIL: FuzzReverse/af69258a12129d6cbba438df5d5f25ba0ec050461c116f777e77ea7c9a0d217a (0.00s)
        reverse_test.go:20: Reverse produced invalid string
FAIL
exit status 1
FAIL    example/fuzz  0.016s

```

--------------------------------

### Go Send Statement Example

Source: https://go.dev/doc/go_spec

An example illustrating how to send a value to a channel in Go. This demonstrates the practical application of the send statement syntax.

```Go
ch <- 3  // send value 3 to channel ch
```

--------------------------------

### Verify and Inspect a Specific Go Version (Go)

Source: https://go.dev/doc/manage-install

After installing a specific Go version, this command verifies the installation and shows its GOROOT. Useful for managing multiple Go environments.

```bash
$ go1.10.7 version
go version go1.10.7 linux/amd64

$ go1.10.7 env GOROOT
```

--------------------------------

### Run Modified Go Program

Source: https://go.dev/doc/tutorial/workspaces

Executes the modified Go program from the workspace directory using `go run`. This command builds and runs the `hello` program, showcasing the integration of the custom `reverse.Int` function. The output reflects the successful reversal of the integer.

```bash
$ go run ./hello
olleH 10642

```

--------------------------------

### Install Go Telemetry Command Line Tool

Source: https://go.dev/doc/telemetry

Installs the `gotelemetry` command-line tool, which can be used to configure telemetry modes and inspect local telemetry data prior to Go 1.23, or for more detailed management.

```bash
go install golang.org/x/telemetry/cmd/gotelemetry@latest
```

--------------------------------

### Build Go Compiler and Standard Library

Source: https://go.dev/doc/contribute

Builds the Go compiler and standard library without running the test suite. This is a faster alternative to `all.bash` when tests are not immediately required.

```shell
$ make.bash

```

--------------------------------

### MySQL CLI: Create Database and Table

Source: https://go.dev/doc/tutorial/database-access

This snippet demonstrates using the MySQL command-line interface (CLI) to create a database named 'recordings', create an 'album' table with columns for id, title, artist, and price, and insert sample data. It also shows how to source an SQL script and verify data insertion.

```mysql
mysql> create database recordings;

```

```mysql
mysql> use recordings;

```

```sql
DROP TABLE IF EXISTS album;
CREATE TABLE album (
  id         INT AUTO_INCREMENT NOT NULL,
  title      VARCHAR(128) NOT NULL,
  artist     VARCHAR(255) NOT NULL,
  price      DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO album
  (title, artist, price)
VALUES
  ('Blue Train', 'John Coltrane', 56.99),
  ('Giant Steps', 'John Coltrane', 63.99),
  ('Jeru', 'Gerry Mulligan', 17.99),
  ('Sarah Vaughan', 'Sarah Vaughan', 34.98);

```

```mysql
mysql> source /path/to/create-tables.sql

```

```mysql
mysql> select * from album;

```

--------------------------------

### Go Doc Command Example: Searching Type Information

Source: https://go.dev/doc/comment

Provides an example of using the `go doc` command to search for specific information related to types. This command-line example shows how to find index pairs related to regular expression matching.

```shell
$ go doc -all regexp | grep pairs
    FindReaderSubmatchIndex returns a slice holding the index pairs identifying
    FindStringSubmatchIndex returns a slice holding the index pairs identifying
    FindSubmatchIndex returns a slice holding the index pairs identifying the
```

--------------------------------

### Build Go distribution using make.bash

Source: https://go.dev/doc/install/source

Compiles the Go distribution from source without running extensive tests. This is a faster alternative to 'all.bash' for users who do not need to run the test suite. Use 'make.bat' on Windows.

```bash
$ cd src
$ ./make.bash
```

--------------------------------

### Switch to master branch using Git

Source: https://go.dev/doc/install/source

Moves the current Git repository checkout from a release tag to the master branch. This step is optional and intended for users who plan to modify the Go source code or contribute to the project.

```bash
$ git checkout master
```

--------------------------------

### Examine Value, Kind, and Concrete Value in Go Reflection

Source: https://go.dev/doc/articles/laws_of_reflection

Shows how to use methods on a reflect.Value object to retrieve its Type, check its Kind, and get the concrete value. The example demonstrates accessing a float64 value and verifying its kind.

```go
var x float64 = 3.4
v := reflect.ValueOf(x)
fmt.Println("type:", v.Type())
fmt.Println("kind is float64:", v.Kind() == reflect.Float64)
fmt.Println("value:", v.Float())
```

--------------------------------

### syscall: Creating Processes as Another User on Windows

Source: https://go.dev/doc/go1

Explains how the syscall package on Windows, using the new SysProcAttr.Token field, enables the creation of processes that run under a different user account via StartProcess.

```go
import (
    "syscall"
    "os/exec"
    "fmt"
)

func main() {
    // This is a conceptual example. Actual token handling requires security context.
    // For a real-world scenario, you would obtain a valid security token.
    // var userToken syscall.Token
    // ... obtain userToken ...

    proc := &exec.Cmd{
        Path: "C:\\Windows\\System32\\notepad.exe",
        SysProcAttr: &syscall.SysProcAttr{
            // Token: userToken, // Assign the obtained user token here
            // HideWindow: true, // Example of other attributes
        },
    }

    // In a real scenario, ensure the token is valid and has necessary privileges.
    // err := proc.Start()
    // if err != nil {
    //     fmt.Printf("Failed to start process as user: %v\n", err)
    // }
    fmt.Println("Conceptual example of SysProcAttr.Token for user impersonation.")
}
```

--------------------------------

### Set Go Install Bin Directory using `go env`

Source: https://go.dev/doc/tutorial/compile-install

Alternatively, set the `GOBIN` environment variable to specify a custom directory for Go program installations. This command modifies the Go environment settings.

```bash
# Linux/Mac example:
$ go env -w GOBIN=/path/to/your/bin
```

```bash
# Windows example:
$ go env -w GOBIN=C:\path\to\your\bin
```

--------------------------------

### Go Fuzz Test Failure Output and Corpus File

Source: https://go.dev/doc/tutorial/fuzz

Illustrates the output when a Go fuzz test fails, highlighting the error message and the location of the failing input in the test corpus. It also shows the format of the corpus file.

```bash
$ go test -fuzz=Fuzz
fuzz: elapsed: 0s, gathering baseline coverage: 0/3 completed
fuzz: elapsed: 0s, gathering baseline coverage: 3/3 completed, now fuzzing with 8 workers
fuzz: minimizing 38-byte failing input file...
--- FAIL: FuzzReverse (0.01s)
    --- FAIL: FuzzReverse (0.00s)
        reverse_test.go:20: Reverse produced invalid UTF-8 string "\x9c\xdd"

    Failing input written to testdata/fuzz/FuzzReverse/af69258a12129d6cbba438df5d5f25ba0ec050461c116f777e77ea7c9a0d217a
    To re-run:
    go test -run=FuzzReverse/af69258a12129d6cbba438df5d5f25ba0ec050461c116f777e77ea7c9a0d217a
FAIL
exit status 1
FAIL    example/fuzz  0.030s

```

```go
go test fuzz v1
string("泃")

```

--------------------------------

### Initialize a Go Project with Modules

Source: https://go.dev/doc/go_faq

This command initializes a new Go project using Go modules. It creates a `go.mod` file which tracks the project's dependencies and their versions. This is the starting point for managing package versions in Go.

```go
go mod init example/project
```

--------------------------------

### Create a Simple 'Hello, World!' Go Program

Source: https://go.dev/doc/code

Defines a basic 'Hello, world!' program in Go. It uses the `main` package and the `fmt` package to print a message to the console. This is a common starting point for Go development.

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world.")
}
```

--------------------------------

### Go Binary Search Example

Source: https://go.dev/doc/comment

This Go code snippet demonstrates the implementation of a binary search algorithm. It includes a sample function `Search` and a whimsical example function `GuessingGame` for guessing a number.

```Go
package sort

// Search uses binary search...
//
// As a more whimsical example, this program guesses your number:
//
//  func GuessingGame() {
//      var s string
//      fmt.Printf("Pick an integer from 0 to 100.\n")
//      answer := sort.Search(100, func(i int) bool {
//          fmt.Printf("Is your number <= %d? ", i)
//          fmt.Scanf("%s", &s)
//          return s != "" && s[0] == 'y'
//      })
//      fmt.Printf("Your number is %d.\n", answer)
//  }
func Search(n int, f func(int) bool) int {
    ...
}
```

--------------------------------

### Launch Goroutine with Anonymous Function (Go)

Source: https://go.dev/doc/effective_go

Demonstrates launching a goroutine that executes an anonymous function (a closure). This is useful for tasks that require setup or specific logic before execution, such as delaying a print statement. The example highlights the need to immediately invoke the function literal with `()` and how closures capture variables from their surrounding scope.

```go
func Announce(message string, delay time.Duration) {
    go func() {
        time.Sleep(delay)
        fmt.Println(message)
    }()  // Note the parentheses - must call the function.
}

```

--------------------------------

### Add Go Install Directory to Shell PATH

Source: https://go.dev/doc/tutorial/compile-install

Configures the system's shell to recognize executables installed by Go without requiring their full path. The specific command varies by operating system.

```bash
# On Linux or Mac:
$ export PATH=$PATH:/path/to/your/install/directory
```

```bash
# On Windows:
$ set PATH=%PATH%;C:\path\to\your\install\directory
```

--------------------------------

### Run Go Full Test Suite

Source: https://go.dev/doc/contribute

Builds and runs the entire Go test suite. This comprehensive test is crucial for ensuring that changes do not negatively impact other parts of the Go distribution. Use `all.bat` on Windows.

```shell
$ cd go/src
$ ./all.bash

```

--------------------------------

### Go: Panic and Recover Mechanics Example

Source: https://go.dev/doc/articles/defer_panic_recover

A complete example demonstrating the interplay between defer, panic, and recover. It shows how to halt execution with panic and gracefully regain control using recover within a deferred function.

```Go
package main

import "fmt"

func main() {
    f()
    fmt.Println("Returned normally from f.")
}

func f() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered in f", r)
        }
    }()
    fmt.Println("Calling g.")
    g(0)
    fmt.Println("Returned normally from g.")
}

func g(i int) {
    if i > 3 {
        fmt.Println("Panicking!")
        panic(fmt.Sprintf("%v", i))
    }
    defer fmt.Println("Defer in g", i)
    fmt.Println("Printing in g", i)
    g(i + 1)
}

```

--------------------------------

### Go Empty and Basic Struct Examples

Source: https://go.dev/doc/go_spec

Illustrates the declaration of an empty struct and a struct with multiple fields of different types. It shows how to declare fields and includes an example of padding.

```Go
// An empty struct.
struct {}

// A struct with 6 fields.
struct {
	x, y int
	u float32
	_ float32  // padding
	A *[]int
	F func()
}

```

--------------------------------

### Install Go Command

Source: https://go.dev/doc/modules/layout

Installs a Go command-line tool from a remote repository. The '@latest' tag ensures the latest version is installed. This command is used to make Go programs globally accessible on a system.

```bash
$ go install github.com/someuser/modname@latest
```

--------------------------------

### Go Module Pre-release Version Identifiers

Source: https://go.dev/doc/modules/release-workflow

Examples of pre-release version identifiers used for Go modules. These versions indicate that the module is not yet stable and may undergo changes. Developers must explicitly specify these versions when using `go get`.

```go
v0.2.1-beta.1
v1.2.3-alpha
```

--------------------------------

### Go Toolchain Switch Notification Example

Source: https://go.dev/doc/toolchain

This snippet shows an example message printed by the `go` command when it detects a module requiring a newer Go version and switches to an appropriate toolchain. This message indicates the module dependency and the Go version the toolchain is switching to.

```go
go: module example.com/widget@v1.2.3 requires go >= 1.24rc1; switching to go 1.27.9

```

--------------------------------

### Add Int Reversal Function to reverse Package

Source: https://go.dev/doc/tutorial/workspaces

Defines a new function `Int` within the `reverse` package that reverses an integer. This function is added to a local copy of the `golang.org/x/example/hello/reverse` package. It depends on the `strconv` package for string conversions.

```go
package reverse

import "strconv"

// Int returns the decimal reversal of the integer i.
func Int(i int) int {
    i, _ = strconv.Atoi(String(strconv.Itoa(i)))
    return i
}

```

--------------------------------

### Clone Go Source Code Repository (Bash)

Source: https://go.dev/doc/contribute

Clones the Go source code from go.googlesource.com. This is the first step before making any changes. It ensures you have a local copy of the repository to work with. Dependencies include git.

```bash
$ git clone https://go.googlesource.com/go
$ cd go
$ ./all.bash                                # compile and test
```

```bash
$ git clone https://go.googlesource.com/tools
$ cd tools
$ go test ./...                             # compile and test
```

--------------------------------

### Launch GDB for Go Binary

Source: https://go.dev/doc/gdb

Command to start the GNU Debugger (GDB) and load a Go executable for debugging. This initiates the debugging session with the specified binary.

```bash
gdb regexp.test
```

--------------------------------

### Go Web Server: View and Edit Handlers

Source: https://go.dev/doc/articles/wiki/part3_m=text

Defines HTTP handlers for '/view/' and '/edit/' routes. 'viewHandler' loads and displays a page, while 'editHandler' loads an existing page or creates a new one for editing.

```go
func viewHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/view/"):]
	p, _ := loadPage(title)
	renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/edit/"):]
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}
```

--------------------------------

### Go Function Signature Examples

Source: https://go.dev/doc/go_spec

Illustrates various function signatures in Go, demonstrating different ways to define parameters and return types. Includes examples of zero, single, multiple, named, and variadic parameters.

```Go
func()
func(x int) int
func(a, _ int, z float32) bool
func(a, b int, z float32) (bool)
func(prefix string, values ...int)
func(a, b int, z float64, opt ...interface{}) (success bool)
func(int, int, float64) (float64, *[]int)
func(n int) func(p *T)

```

--------------------------------

### Go Get Pre-release Version Command

Source: https://go.dev/doc/modules/release-workflow

Demonstrates how to use the `go get` command to retrieve a specific pre-release version of a Go module. This is necessary because `go get` prioritizes release versions by default.

```shell
go get example.com/theirmodule@v1.2.3-alpha
```

--------------------------------

### Compile and Run Go Program

Source: https://go.dev/doc/articles/wiki

Commands to compile and execute the Go wiki program. This involves building the executable using `go build` and then running it. The output demonstrates successful saving and loading of a page.

```bash
$ go build wiki.go
$ ./wiki
This is a sample Page.

```

--------------------------------

### Go Array Literal Initialization Examples

Source: https://go.dev/doc/go_spec

Provides examples of initializing array composite literals in Go. Demonstrates fixed-length arrays with specified lengths and the use of `...` for inferring array length from the number of elements.

```go
buffer := [10]string{}             // len(buffer) == 10
intSet := [6]int{1, 2, 3, 5}       // len(intSet) == 6
days := [...]string{"Sat", "Sun"}  // len(days) == 2

```

--------------------------------

### Add Module to Workspace with go work use

Source: https://go.dev/doc/tutorial/workspaces

Adds a module to the current Go workspace by updating the go.work file. This command allows the Go toolchain to recognize and use local module versions. It takes the path to the module directory as an argument.

```bash
$ go work use ./example/hello

```

--------------------------------

### Go Fuzz Test for Reverse Function

Source: https://go.dev/doc/tutorial/fuzz

This Go code demonstrates how to convert a unit test into a fuzz test for the Reverse function. It uses the 'testing' package and the 'unicode/utf8' package to verify that reversing a string twice returns the original string and that the reversed string remains valid UTF-8. Seed corpus inputs are provided using f.Add.

```go
func FuzzReverse(f *testing.F) {
    testcases := []string{"Hello, world", " ", "!12345"}
    for _, tc := range testcases {
        f.Add(tc)  // Use f.Add to provide a seed corpus
    }
    f.Fuzz(func(t *testing.T, orig string) {
        rev := Reverse(orig)
        doubleRev := Reverse(rev)
        if orig != doubleRev {
            t.Errorf("Before: %q, after: %q", orig, doubleRev)
        }
        if utf8.ValidString(orig) && !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8 string %q", rev)
        }
    })
}
```

--------------------------------

### Go String Reversal Function

Source: https://go.dev/doc/tutorial/fuzz

Implements a function to reverse a given string. It converts the string to a byte slice, swaps characters from the beginning and end moving inwards, and then converts the byte slice back to a string. This function is the target for fuzz testing.

```go
package main

import "fmt"

func Reverse(s string) string {
    b := []byte(s)
    for i, j := 0, len(b)-1; i < len(b)/2; i, j = i+1, j-1 {
        b[i], b[j] = b[j], b[i]
    }
    return string(b)
}
```

--------------------------------

### Go Fuzz Test for String Reversal

Source: https://go.dev/doc/tutorial/fuzz

A Go fuzz test for the `Reverse` function. It uses `testing.F` to define the fuzzing target, seeding it with initial test cases. The test ensures that reversing a string twice returns the original string and that the reversed string remains UTF-8 valid.

```go
package main

import (
    "testing"
    "unicode/utf8"
)

func FuzzReverse(f *testing.F) {
    testcases := []string{"Hello, world", " ", "!12345"}
    for _, tc := range testcases {
        f.Add(tc) // Use f.Add to provide a seed corpus
    }
    f.Fuzz(func(t *testing.T, orig string) {
        rev, err1 := Reverse(orig)
        if err1 != nil {
            return
        }
        doubleRev, err2 := Reverse(rev)
        if err2 != nil {
            return
        }
        if orig != doubleRev {
            t.Errorf("Before: %q, after: %q", orig, doubleRev)
        }
        if utf8.ValidString(orig) && !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8 string %q", rev)
        }
    })
}

```

--------------------------------

### Debug String Conversion to Runes in Go

Source: https://go.dev/doc/tutorial/fuzz

This Go code snippet adds print statements to a string reversal function to help debug issues related to converting strings to runes. It logs the input string and the resulting rune slice, aiding in the diagnosis of UTF-8 encoding problems.

```go
func Reverse(s string) string {
    fmt.Printf("input: %q\n", s)
    r := []rune(s)
    fmt.Printf("runes: %q\n", r)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}
```

--------------------------------

### Update Go Fuzz Target for Debugging

Source: https://go.dev/doc/tutorial/fuzz

Modifies the fuzz target function within a Go test file to include logging for rune counts and UTF-8 validity checks. This helps in debugging issues where string reversal might produce invalid UTF-8.

```go
f.Fuzz(func(t *testing.T, orig string) {
    rev := Reverse(orig)
    doubleRev := Reverse(rev)
    t.Logf("Number of runes: orig=%d, rev=%d, doubleRev=%d", utf8.RuneCountInString(orig), utf8.RuneCountInString(rev), utf8.RuneCountInString(doubleRev))
    if orig != doubleRev {
        t.Errorf("Before: %q, after: %q", orig, doubleRev)
    }
    if utf8.ValidString(orig) && !utf8.ValidString(rev) {
        t.Errorf("Reverse produced invalid UTF-8 string %q", rev)
    }
})

```

--------------------------------

### Serve Wiki Pages with Go net/http

Source: https://go.dev/doc/articles/wiki

Shows how to serve wiki pages using Go's net/http package. It includes a handler function to extract page titles from URLs and load page content, then format it for display. This example builds upon the basic web server to serve specific content based on URL paths.

```go
import (
    "fmt"
    "os"
    "log"
    "net/http"
)

func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, _ := loadPage(title)
    fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", p.Title, p.Body)
}

func main() {
    http.HandleFunc("/view/", viewHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}

```

--------------------------------

### Linux: Remove Old Go and Extract New Version

Source: https://go.dev/doc/install

This command removes any existing Go installation from /usr/local/go and then extracts the new Go archive to /usr/local. Ensure you have the necessary permissions (root or sudo) before running.

```bash
$ rm -rf /usr/local/go && tar -C /usr/local -xzf go1.25.3.linux-amd64.tar.gz
```

--------------------------------

### Go Unit Test for Reverse Function

Source: https://go.dev/doc/tutorial/fuzz

This Go code defines a unit test for the Reverse function. It uses a slice of structs to hold input and expected output pairs, iterating through them to verify the function's correctness. It requires the 'testing' package. The input is a string, and the output is a string.

```go
package main

import (
    "testing"
)

func TestReverse(t *testing.T) {
    testcases := []struct {
        in, want string
    }{
        {"Hello, world", "dlrow ,olleH"},
        {" ", " "},
        {"!12345", "54321!"},
    }
    for _, tc := range testcases {
        rev := Reverse(tc.in)
        if rev != tc.want {
                t.Errorf("Reverse: %q, want %q", rev, tc.want)
        }
    }
}
```

--------------------------------

### Initializing a Git Repository and Committing Changes in Go Project

Source: https://go.dev/doc/code

Demonstrates initializing a Git repository, adding Go module and source files, and making an initial commit. This is a standard workflow for version control in software development.

```bash
git init
git add go.mod hello.go
git commit -m "initial commit"
```

--------------------------------

### Go Panic Examples

Source: https://go.dev/doc/go_spec

Examples demonstrating how to use the panic function in Go with different types of arguments. These examples show triggering a panic with an integer, a string, and a custom error type.

```go
panic(42)
panic("unreachable")
panic(Error("cannot parse"))
```

--------------------------------

### Go Module Pre-release Version Example

Source: https://go.dev/doc/modules/version-numbers

Shows an example of a pre-release version in Go modules, indicated by appending a hyphen and an identifier (e.g., '-beta.2') to a standard version. This signifies a pre-release milestone without stability guarantees.

```go
vx.x.x-beta.2
```

--------------------------------

### Run Compiled Go Application

Source: https://go.dev/doc/tutorial/compile-install

Executes the compiled Go application. The command to run the executable depends on the operating system.

```bash
# On Linux or Mac:
$ ./hello
```

```bash
# On Windows:
$ hello.exe
```

--------------------------------

### Initialize Go Wiki File and Import Packages

Source: https://go.dev/doc/articles/wiki

This Go code snippet initializes a new Go file 'wiki.go' for a web application. It includes the necessary 'fmt' and 'os' packages from the standard library, which are foundational for input/output operations and formatted string manipulation.

```go
package main

import (
    "fmt"
    "os"
)
```

--------------------------------

### Go Short Variable Declaration Example

Source: https://go.dev/doc/go_faq

Illustrates Go's short variable declaration syntax using `:=`, showing its equivalence to a full variable declaration with type conversion.

```go
var a uint64 = 1
a := uint64(1)

```

--------------------------------

### Go Chart Configuration Example

Source: https://go.dev/doc/telemetry

This snippet shows an example configuration for a chart in the telemetry system. It defines the chart's title, the counters to aggregate, its type, associated issues, the program it applies to, and its version. This configuration is part of the chartconfig package.

```yaml
title: Editor Distribution
counter: gopls/client:{vscode,vscodium,vscode-insiders,code-server,eglot,govim,neovim,coc.nvim,sublimetext,other}
description: measure editor distribution for gopls users.
type: partition
issue: https://go.dev/issue/61038
issue: https://go.dev/issue/62214 # add vscode-insiders
program: golang.org/x/tools/gopls
version: v0.13.0 # temporarily back-version to demonstrate config generation.

```

--------------------------------

### Go Qualified Identifier Example

Source: https://go.dev/doc/go_spec

Provides a concrete example of a qualified identifier in Go, showing how to reference the 'Sin' function within the 'math' package.

```go
math.Sin // denotes the Sin function in package math
```

--------------------------------

### Go Channel Creation with 'make'

Source: https://go.dev/doc/go_spec

Shows how to create a new, initialized channel using the `make` function in Go. It includes an example of creating a buffered channel with a specified capacity, which affects communication behavior.

```go
make(chan int, 100)

```

--------------------------------

### Go Function and Method Call Examples

Source: https://go.dev/doc/go_spec

Provides examples of function and method calls in Go. It shows a standard function call `math.Atan2(x, y)` and a method call `pt.Scale(3.5)` on a pointer receiver.

```go
math.Atan2(x, y)  // function call
var pt *Point
pt.Scale(3.5)     // method call with receiver pt
```

--------------------------------

### Fix String Reversal Bug in Go

Source: https://go.dev/doc/tutorial/fuzz

This Go code snippet demonstrates how to fix a string reversal function that incorrectly handles multi-byte UTF-8 characters. It replaces byte-wise reversal with rune-wise reversal to ensure correct handling of international characters.

```go
func Reverse(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}
```

--------------------------------

### Run Tests in golang.org/x/... Repositories

Source: https://go.dev/doc/contribute

Executes tests for all packages within a repository under golang.org/x/. This command is used for testing external Go libraries.

```shell
$ cd tools
$ go test ./

```

--------------------------------

### Go Package Declaration Example

Source: https://go.dev/doc/go_spec

An example of a package clause in Go, declaring that a source file belongs to the 'math' package.

```go
package math
```

--------------------------------

### Go Data Race Detector Report Format Example

Source: https://go.dev/doc/articles/race_detector

Presents an example of a data race report generated by the Go race detector, including stack traces for conflicting accesses and goroutine creation points.

```text
WARNING: DATA RACE
Read by goroutine 185:
  net.(*pollServer).AddFD()
      src/net/fd_unix.go:89 +0x398
  net.(*pollServer).WaitWrite()
      src/net/fd_unix.go:247 +0x45
  net.(*netFD).Write()
      src/net/fd_unix.go:540 +0x4d4
  net.(*conn).Write()
      src/net/net.go:129 +0x101
  net.func·060()
      src/net/timeout_test.go:603 +0xaf

Previous write by goroutine 184:
  net.setWriteDeadline()
      src/net/sockopt_posix.go:135 +0xdf
  net.setDeadline()
      src/net/sockopt_posix.go:144 +0x9c
  net.(*conn).SetDeadline()
      src/net/net.go:161 +0xe3
  net.func·061()
      src/net/timeout_test.go:616 +0x3ed

Goroutine 185 (running) created at:
  net.func·061()
      src/net/timeout_test.go:609 +0x288

Goroutine 184 (running) created at:
  net.TestProlongTimeout()
      src/net/timeout_test.go:618 +0x298
  testing.tRunner()
      src/testing/testing.go:301 +0xe8
```

--------------------------------

### Compile Go File with gccgo

Source: https://go.dev/doc/install/gccgo

Compiles a single Go source file (`file.go`) into an object file (`file.o`) using the gccgo compiler. This is a preliminary step before linking.

```bash
gccgo -c file.go
```

--------------------------------

### Go HTTP Server for Page Management

Source: https://go.dev/doc/articles/wiki/part2_m=text

This Go code sets up an HTTP server to handle page viewing. It includes functions for loading page data from files and a handler to display the page content. The server listens on port 8080. Dependencies include the 'fmt', 'log', 'net/http', and 'os' packages.

```Go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/view/"):]
	p, _ := loadPage(title)
	fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", p.Title, p.Body)
}

func main() {
	http.HandleFunc("/view/", viewHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

```

--------------------------------

### Create Project Directory and Initialize Go Module

Source: https://go.dev/doc/tutorial/web-service-gin

This snippet demonstrates how to create a new project directory and initialize a Go module using the `go mod init` command. This is essential for managing dependencies in a Go project.

```bash
$ mkdir web-service-gin
$ cd web-service-gin
$ go mod init example/web-service-gin
go: creating new go.mod: module example/web-service-gin
```

--------------------------------

### Install Multiple Go Programs from Separate Directories

Source: https://go.dev/doc/modules/layout

Demonstrates how to install multiple Go programs residing in separate subdirectories within a repository. Each program is expected to have its own `main.go` file and declare `package main`. Shared internal packages can be placed in an `internal` directory.

```go
project-root-directory/
  go.mod
  internal/
    ... shared internal packages
  prog1/
    main.go
  prog2/
    main.go
```

```bash
$ go install github.com/someuser/modname/prog1@latest
$ go install github.com/someuser/modname/prog2@latest
```

--------------------------------

### Go Program for Vulnerability Scanning Demo

Source: https://go.dev/doc/tutorial/govulncheck-ide

This Go program demonstrates parsing command-line language tags, which is used as an example for scanning dependencies in the tutorial. It requires the 'golang.org/x/text' package.

```go
// This program takes language tags as command-line
// arguments and parses them.

package main

import (
  "fmt"
  "os"

  "golang.org/x/text/language"
)

func main() {
  for _, arg := range os.Args[1:] {
    tag, err := language.Parse(arg)
    if err != nil {
      fmt.Printf("%s: error: %v\n", arg, err)
    } else if tag == language.Und {
      fmt.Printf("%s: undefined\n", arg)
    } else {
      fmt.Printf("%s: tag %s\n", arg, tag)
    }
  }
}

```

--------------------------------

### Go Wiki Page Management and HTTP Handlers

Source: https://go.dev/doc/articles/wiki/part3

This Go code defines the structure for wiki pages and implements functions to save and load page content to/from files. It also includes HTTP handlers for viewing and editing wiki pages, utilizing HTML templates for rendering. Dependencies include 'html/template', 'log', 'net/http', and 'os'.

```go
package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	t, _ := template.ParseFiles(tmpl + ".html")
	t.Execute(w, p)
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/view/"):]
	p, _ := loadPage(title)
	renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/edit/"):]
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}

func main() {
	http.HandleFunc("/view/", viewHandler)
	http.HandleFunc("/edit/", editHandler)
	//http.HandleFunc("/save/", saveHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

```

--------------------------------

### Go Web Server: Template Rendering Function

Source: https://go.dev/doc/articles/wiki/part3_m=text

A utility function to render HTML templates with provided page data. It uses the 'html/template' package to parse and execute templates.

```go
func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	t, _ := template.ParseFiles(tmpl + ".html")
	t.Execute(w, p)
}
```

--------------------------------

### Go Web Wiki: Page Management and HTTP Handlers

Source: https://go.dev/doc/articles/wiki/final

This Go code defines the core logic for a web wiki. It includes functions for loading and saving page content, handling HTTP requests for viewing, editing, and saving pages, and rendering templates. It utilizes the `net/http` package for web server functionalities and `os` for file operations.

```go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore

package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"regexp"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		http.Redirect(w, r, "/edit/"+title, http.StatusFound)
		return
	}
	renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}

func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")
	p := &Page{Title: title, Body: []byte(body)}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/view/"+title, http.StatusFound)
}

var templates = template.Must(template.ParseFiles("edit.html", "view.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var validPath = regexp.MustCompile("^/(edit|save|view)/([a-zA-Z0-9]+)$")

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		fn(w, r, m[2])
	}
}

func main() {
	http.HandleFunc("/view/", makeHandler(viewHandler))
	http.HandleFunc("/edit/", makeHandler(editHandler))
	http.HandleFunc("/save/", makeHandler(saveHandler))

	log.Fatal(http.ListenAndServe(":8080", nil))
}

```

--------------------------------

### Go Defer with Argument Evaluation for Tracing

Source: https://go.dev/doc/effective_go

Demonstrates an advanced use of defer where arguments to deferred functions are evaluated when `defer` is executed, not when the deferred call happens. This enables dynamic tracing setup.

```Go
func trace(s string) string {
    fmt.Println("entering:", s)
    return s
}

func un(s string) {
    fmt.Println("leaving:", s)
}

func a() {
    defer un(trace("a"))
    fmt.Println("in a")
}

func b() {
    defer un(trace("b"))
    fmt.Println("in b")
    a()
}

func main() {
    b()
}
```

--------------------------------

### Establish MySQL Database Connection in Go

Source: https://go.dev/doc/tutorial/database-access

This Go code snippet initializes a database handle (*sql.DB) for a MySQL database. It configures connection properties like user, password, network address, and database name, then formats them into a DSN. The code also includes error handling for opening the connection and pinging the database to verify connectivity. Global variables are used for simplicity in this example.

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
    // Capture connection properties.
    cfg := mysql.NewConfig()
    cfg.User = os.Getenv("DBUSER")
    cfg.Passwd = os.Getenv("DBPASS")
    cfg.Net = "tcp"
    cfg.Addr = "127.0.0.1:3306"
    cfg.DBName = "recordings"

    // Get a database handle.
    var err error
    db, err = sql.Open("mysql", cfg.FormatDSN())
    if err != nil {
        log.Fatal(err)
    }

    pingErr := db.Ping()
    if pingErr != nil {
        log.Fatal(pingErr)
    }
    fmt.Println("Connected!")
}
```

--------------------------------

### Clean Go Build Cache and Module Cache (Go)

Source: https://go.dev/doc/manage-install

Commands to clear intermediate build artifacts and downloaded dependencies. Essential for freeing up disk space and ensuring clean builds.

```bash
go clean -cache
go clean -modcache
```

--------------------------------

### Go Read Function Signature Example

Source: https://go.dev/doc/go_spec

An example function signature for reading data from a file, demonstrating the use of the `error` interface for return values.

```go
func Read(f *File, b []byte) (n int, err error)

```

--------------------------------

### Implement UTF-8 Validated String Reversal in Go

Source: https://go.dev/doc/tutorial/fuzz

This Go function reverses a string while ensuring the input is valid UTF-8. It returns an error if the string is not valid UTF-8, otherwise, it returns the reversed string and a nil error. This function is essential for handling international characters correctly.

```go
import (
    "errors"
    "unicode/utf8"
)

func Reverse(s string) (string, error) {
    if !utf8.ValidString(s) {
        return s, errors.New("input is not valid UTF-8")
    }
    r := []rune(s)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r), nil
}
```

--------------------------------

### Create Customer Order with Transaction (Go)

Source: https://go.dev/doc/database/execute-transactions

This Go function demonstrates creating a new customer order. It begins a transaction, defers a rollback, checks inventory, updates inventory, creates the order, and finally commits the transaction. It uses `context.Context` for cancellable operations and `Tx` methods for transactional database interactions. Dependencies include the `database/sql` package and `fmt` for error formatting.

```go
package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// Assume db is a pre-configured *sql.DB connection
var db *sql.DB

// CreateOrder creates an order for an album and returns the new order ID.
func CreateOrder(ctx context.Context, albumID, quantity, custID int) (orderID int64, err error) {

	// Create a helper function for preparing failure results.
	fail := func(err error) (int64, error) {
		return 0, fmt.Errorf("CreateOrder: %v", err)
	}

	// Get a Tx for making transaction requests.
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fail(err)
	}
	// Defer a rollback in case anything fails.
	defer tx.Rollback()

	// Confirm that album inventory is enough for the order.
	var enough bool
	if err = tx.QueryRowContext(ctx, "SELECT (quantity >= ?) from album where id = ?",
		quantity, albumID).Scan(&enough); err != nil {
		if err == sql.ErrNoRows {
			return fail(fmt.Errorf("no such album"))
		}
		return fail(err)
	}
	if !enough {
		return fail(fmt.Errorf("not enough inventory"))
	}

	// Update the album inventory to remove the quantity in the order.
	_, err = tx.ExecContext(ctx, "UPDATE album SET quantity = quantity - ? WHERE id = ?",
		quantity, albumID)
	if err != nil {
		return fail(err)
	}

	// Create a new row in the album_order table.
	result, err := tx.ExecContext(ctx, "INSERT INTO album_order (album_id, cust_id, quantity, date) VALUES (?, ?, ?, ?)",
		albumID, custID, quantity, time.Now())
	if err != nil {
		return fail(err)
	}
	// Get the ID of the order item just created.
	orderID, err = result.LastInsertId()
	if err != nil {
		return fail(err)
	}

	// Commit the transaction.
	if err = tx.Commit(); err != nil {
		return fail(err)
	}

	// Return the order ID.
	return orderID, nil
}

```

--------------------------------

### Go Append Slice to Slice Example

Source: https://go.dev/doc/effective_go

This example demonstrates appending all elements from one slice (`y`) to another slice (`x`) using the `...` operator at the call site. This unpacks the elements of `y` into individual arguments for append.

```go
x := []int{1,2,3}
y := []int{4,5,6}
x = append(x, y...)
fmt.Println(x)
```

--------------------------------

### Install Go Commands from a 'cmd' Directory

Source: https://go.dev/doc/modules/layout

Illustrates a project structure where Go commands are organized within a `cmd` directory, alongside importable packages. This structure is useful for mixed repositories containing both commands and reusable packages. Users can import packages and install commands.

```go
project-root-directory/
  go.mod
  modname.go
  modname_test.go
  auth/
    auth.go
    auth_test.go
  internal/
    ... internal packages
  cmd/
    prog1/
      main.go
    prog2/
      main.go
```

```go
import "github.com/someuser/modname"
import "github.com/someuser/modname/auth"
```

```bash
$ go install github.com/someuser/modname/cmd/prog1@latest
$ go install github.com/someuser/modname/cmd/prog2@latest
```

--------------------------------

### Run Gin Module Dependency

Source: https://go.dev/doc/tutorial/web-service-gin

This command adds the github.com/gin-gonic/gin module as a dependency for your Go module. It uses 'go get' to fetch and manage dependencies. Ensure you are in the directory containing your Go code.

```bash
$ go get .
go get: added github.com/gin-gonic/gin v1.7.2

```

--------------------------------

### HTML View Template

Source: https://go.dev/doc/articles/wiki

This is an example of an HTML template file ('view.html') used for displaying page content. It shows the page title and body, with a link to edit the page.

```html
<h1>{{.Title}}</h1>

<p>[<a href="/edit/{{.Title}}">edit</a>]</p>

<div>{{printf "%s" .Body}}</div>
```

--------------------------------

### Go Type Identity Examples

Source: https://go.dev/doc/go_spec

Provides examples of Go type declarations and their subsequent comparisons to demonstrate type identity. It covers aliases, structs, functions, and generic instantiations.

```go
type (
	A0 = []string
	A1 = A0
	A2 = struct{ a, b int }
	A3 = int
	A4 = func(A3, float64) *A0
	A5 = func(x int, _ float64) *[]string

	B0 A0
	B1 []string
	B2 struct{ a, b int }
	B3 struct{ a, c int }
	B4 func(int, float64) *B0
	B5 func(x int, y float64) *A1

	C0 = B0
	D0[P1, P2 any] struct{ x P1; y P2 }
	E0 = D0[int, string]
)

// Identical types:
// A0, A1, and []string
// A2 and struct{ a, b int }
// A3 and int
// A4, func(int, float64) *[]string, and A5
// B0 and C0
// D0[int, string] and E0
// []int and []int
// struct{ a, b *B5 } and struct{ a, b *B5 }
// func(x int, y float64) *[]string, func(int, float64) (result *[]string), and A5

// Different types:
// B0 and B1
// func(int, float64) *B0 and func(x int, y float64) *[]string
// P1 and P2
// D0[int, string] and struct{ x int; y string }
```

--------------------------------

### Linux/Mac: Add Go to PATH Environment Variable

Source: https://go.dev/doc/install

This command adds the Go binary directory to your PATH environment variable. This allows you to run Go commands from any directory. Apply changes by logging out and back in, or by sourcing the profile file.

```bash
export PATH=$PATH:/usr/local/go/bin
```

--------------------------------

### Go Defer for Function Tracing

Source: https://go.dev/doc/effective_go

Shows a simple method for tracing function execution using defer. A `trace` function is called at the start, and `untrace` is deferred to run upon function exit.

```Go
func trace(s string)   { fmt.Println("entering:", s) }
func untrace(s string) { fmt.Println("leaving:", s) }

// Use them like this:
func a() {
    trace("a")
    defer untrace("a")
    // do something....
}
```

--------------------------------

### Link Imported Packages Explicitly with gccgo

Source: https://go.dev/doc/install/gccgo

Demonstrates the manual process of compiling a package (`mypackage.go`) and then linking its object file (`mypackage.o`) with another file (`main.go`) that imports it to create the final executable (`main`).

```bash
gccgo -c mypackage.go              # Exports mypackage
gccgo -c main.go                   # Imports mypackage
gccgo -o main main.o mypackage.o   # Explicitly links with mypackage.o
```

--------------------------------

### Go Basic Interface Example

Source: https://go.dev/doc/go_spec

A Go code example defining a basic interface named 'File'. This interface specifies three methods: Read, Write, and Close, which are common for file-like objects.

```Go
// A simple File interface.
interface {
	Read([]byte) (int, error)
	Write([]byte) (int, error)
	Close() error
}

```

--------------------------------

### Assembler Instruction Support (S390X)

Source: https://go.dev/doc/go1

Lists the new instructions supported by the assembler for the S390X port, providing additional functionality for this architecture.

```s390x
    TMHH
    TMHL
    TMLH
    TMLL

```

--------------------------------

### Run Go Standard Library Tests

Source: https://go.dev/doc/contribute

Executes all tests within a standard Go package. This command is essential for verifying the correctness of local changes before committing.

```shell
$ go test

```

--------------------------------

### os.File: Setting I/O Deadlines

Source: https://go.dev/doc/go1

Illustrates the addition of SetDeadline, SetReadDeadline, and SetWriteDeadline methods to os.File, enabling the setting of I/O deadlines similar to net.Conn. It also highlights the new IsTimeout function for checking deadline errors.

```go
// Example demonstrating setting read deadline
file, err := os.Open("somefile.txt")
if err != nil {
    // handle error
}
deffer file.Close()

err = file.SetReadDeadline(time.Now().Add(5 * time.Second))
if err != nil {
    // handle error
}

// Attempt to read from the file
buffer := make([]byte, 1024)
_, readErr := file.Read(buffer)

if readErr != nil {
    if os.IsTimeout(readErr) {
        fmt.Println("Read operation timed out")
    } else {
        // handle other read errors
    }
}
```

--------------------------------

### Go Alias Declaration Examples

Source: https://go.dev/doc/go_spec

Provides examples of alias declarations in Go, binding identifiers to existing types, including generic aliases.

```Go
type (
	nodeList = []*Node  // nodeList and []*Node are identical types
	Polar    = polar    // Polar and polar denote identical types
)

type set[P comparable] = map[P]bool

```

--------------------------------

### Go Registering Argument Server Handler

Source: https://go.dev/doc/effective_go

Example of registering the ArgServer function as an HTTP handler in Go using http.HandlerFunc. This makes the server arguments accessible via the '/args' URL.

```go
http.Handle("/args", http.HandlerFunc(ArgServer))
```

--------------------------------

### Submit Changes for Review with Git Codereview

Source: https://go.dev/doc/contribute

Submits local code changes to Gerrit for review. This command initiates the code review process for the Go project.

```shell
$ git codereview mail

```

--------------------------------

### Go Primary Expressions Examples

Source: https://go.dev/doc/go_spec

Provides examples of primary expressions in Go, which are the basic building blocks for more complex expressions. This includes operands, conversions, method calls, and field access.

```Go
x
2
(s + ".txt")
f(3.1415, true)
Point{1, 2}
m["foo"]
s[i : j + 1]
obj.color
f.p[i].x()
```

--------------------------------

### Go Web Server for QR Code Generation

Source: https://go.dev/doc/effective_go

This Go program implements a basic web server that takes a string input from a form, generates a QR code for it using the Google Chart API, and displays the QR code along with the input string on a web page. It uses the `net/http` package for handling HTTP requests and responses, and the `html/template` package for rendering the HTML page dynamically. The `flag` package is used to define a command-line flag for the server address.

```go
package main

import (
    "flag"
    "html/template"
    "log"
    "net/http"
)

var addr = flag.String("addr", ":1718", "http service address") // Q=17, R=18

var templ = template.Must(template.New("qr").Parse(templateStr))

func main() {
    flag.Parse()
    http.Handle("/", http.HandlerFunc(QR))
    err := http.ListenAndServe(*addr, nil)
    if err != nil {
        log.Fatal("ListenAndServe:", err)
    }
}

func QR(w http.ResponseWriter, req *http.Request) {
    templ.Execute(w, req.FormValue("s"))
}

const templateStr = `
<html>
<head>
<title>QR Link Generator</title>
</head>
<body>
{{if .}}
<img src="http://chart.apis.google.com/chart?chs=300x300&cht=qr&choe=UTF-8&chl={{.}}" />
<br>
{{.}}
<br>
<br>
{{end}}
<form action="/" name=f method="GET">
    <input maxLength=1024 size=70 name=s value="" title="Text to QR Encode">
    <input type=submit value="Show QR" name=qr>
</form>
</body>
</html>
`

```

--------------------------------

### Add UTF-8 Error Checking to Go Fuzz Test

Source: https://go.dev/doc/tutorial/fuzz

This Go fuzz test function, `FuzzReverse`, is designed to test the `Reverse` function. It includes checks for `nil` errors after reversing and double-reversing strings. Additionally, it verifies that reversing a valid UTF-8 string does not produce an invalid UTF-8 string. This enhances the robustness of the fuzzing process.

```go
import (
    "testing"
    "unicode/utf8"
    "errors"
    "fmt"
)

func FuzzReverse(f *testing.F) {
    testcases := []string {"Hello, world", " ", "!12345"}
    for _, tc := range testcases {
        f.Add(tc)  // Use f.Add to provide a seed corpus
    }
    f.Fuzz(func(t *testing.T, orig string) {
        rev, err1 := Reverse(orig)
        if err1 != nil {
            return
        }
        doubleRev, err2 := Reverse(rev)
        if err2 != nil {
             return
        }
        if orig != doubleRev {
            t.Errorf("Before: %q, after: %q", orig, doubleRev)
        }
        if utf8.ValidString(orig) && !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8 string %q", rev)
        }
    })
}
```

--------------------------------

### Go Map Creation with 'make'

Source: https://go.dev/doc/go_spec

Shows how to create new, empty map values using the built-in `make` function in Go. It includes examples with and without an optional capacity hint, which can pre-allocate memory for efficiency.

```go
make(map[string]int)
make(map[string]int, 100)

```

--------------------------------

### Go Assignment Evaluation Order Examples

Source: https://go.dev/doc/go_spec

Details the two-phase evaluation of assignments in Go, showing how operands and expressions are evaluated before the assignment occurs, with examples of variable swapping and slice/map modifications.

```go
a, b = b, a  // exchange a and b

x := []int{1, 2, 3}
i := 0
i, x[i] = 1, 2  // set i = 1, x[0] = 2

i = 0
x[i], i = 2, 1  // set x[0] = 2, i = 1

x[0], x[0] = 1, 2  // set x[0] = 1, then x[0] = 2 (so x[0] == 2 at end)

x[1], x[3] = 4, 5  // set x[1] = 4, then panic setting x[3] = 5.

type Point struct { x, y int }
var p *Point
x[2], p.x = 6, 7  // set x[2] = 6, then panic setting p.x = 7

i = 2
x = []int{3, 5, 7}
for i, x[i] = range x {  // set i, x[2] = 0, x[0]
	break
}
// after this loop, i == 0 and x is []int{3, 5, 3}

```

--------------------------------

### Rune Literals Examples in Go

Source: https://go.dev/doc/go_spec

Provides examples of valid and invalid rune literals in Go, demonstrating single characters, multi-byte UTF-8 characters, various escape sequences, and specific error conditions.

```go
'a'
'ä'
'本'
'\t'
'\000'
'\007'
'\377'
'\x07'
'\xff'
'\u12e4'
'\U00101234'
'\''         // rune literal containing single quote character
'aa'         // illegal: too many characters
'\k'        // illegal: k is not recognized after a backslash
'\xa'        // illegal: too few hexadecimal digits
'\0'         // illegal: too few octal digits
'\400'       // illegal: octal value over 255
'\uDFFF'     // illegal: surrogate half
'\U00110000' // illegal: invalid Unicode code point
```

--------------------------------

### Go Map Examples

Source: https://go.dev/doc/go_spec

Illustrates various ways to declare map types in Go, showcasing different key and element types, including pointers, structs, and interfaces. These examples demonstrate the flexibility in defining map structures.

```go
map[string]int
map[*T]struct{ x, y float64 }
map[string]interface{}

```

--------------------------------

### Go Full Slice Expression Example with Array

Source: https://go.dev/doc/go_spec

Provides an example of using a full slice expression on a Go array. It demonstrates how the `max` index influences the capacity of the newly created slice.

```Go
a := [5]int{1, 2, 3, 4, 5}
t := a[1:3:5]

// t has type []int, length 2, capacity 4, and elements:
t[0] == 2
t[1] == 3
```

--------------------------------

### Go Defer LIFO Execution Example

Source: https://go.dev/doc/effective_go

Illustrates the Last-In, First-Out (LIFO) execution order of deferred functions. In this loop, multiple `fmt.Printf` calls are deferred, and they execute in reverse order of their deferral.

```Go
for i := 0; i < 5; i++ {
    defer fmt.Printf("%d ", i)
}
```

--------------------------------

### Go Getter and Setter Method Example

Source: https://go.dev/doc/effective_go

Illustrates idiomatic Go getter and setter methods for an unexported field. The getter is named after the field (capitalized), and the setter uses a 'Set' prefix.

```go
owner := obj.Owner()
if owner != user {
    obj.SetOwner(user)
}
```

--------------------------------

### Go Expression Evaluation Examples

Source: https://go.dev/doc/go_spec

Demonstrates how Go evaluates expressions based on operator precedence and associativity. These examples show the grouping of operations and the order in which they are performed.

```go
+x                         // x
42 + a - b                 // (42 + a) - b
23 + 3*x[i]                // 23 + (3 * x[i])
x <= f()                   // x <= f()
^a >> b                    // (^a) >> b
f() || g()                 // f() || g()
x == y+1 && <-chanInt > 0  // (x == (y+1)) && ((<-chanInt) > 0)

```

--------------------------------

### Go String Literal Examples

Source: https://go.dev/doc/go_spec

Demonstrates various ways to define string literals in Go, including raw, interpreted, and Unicode representations. Shows valid and invalid examples for Unicode code points and escape sequences.

```go
`abc`                // same as "abc"
`\n
\n`                  // same as "\\n\n\\n"
"\n"
"\""                 // same as `"
"Hello, world!\n"
"日本語"
"\u65e5本\U00008a9e"
"\xff\u00FF"
"\uD800"             // illegal: surrogate half
"\U00110000"         // illegal: invalid Unicode code point
```

--------------------------------

### GET /albums/:id - Get Specific Album

Source: https://go.dev/doc/tutorial/web-service-gin

Retrieves a specific album by its unique ID.

```APIDOC
## GET /albums/:id

### Description
Retrieves a specific album by its unique ID. The ID is provided as a path parameter.

### Method
GET

### Endpoint
/albums/:id

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the album to retrieve.

### Response
#### Success Response (200)
- **Album Object** - The album object corresponding to the provided ID.

#### Error Response (404)
- **message** (string) - "album not found"

#### Response Example (Success)
```json
{
        "id": "2",
        "title": "Jeru",
        "artist": "Gerry Mulligan",
        "price": 17.99
}
```

#### Response Example (Not Found)
```json
{
    "message": "album not found"
}
```
```

--------------------------------

### Instrument All Go Packages in go.mod for Coverage

Source: https://go.dev/doc/build-cover

This snippet demonstrates how to instrument all non-stdlib dependencies within your Go module for coverage. It uses `go list` to get import paths, saves them to a file, and then uses `go build -coverpkg` to include them in the build. Finally, it shows how to run the program and analyze the coverage data.

```bash
$ go list -f '{{if not .Standard}}{{.ImportPath}}{{end}}' -deps . | paste -sd "," > pkgs.txt
$ go build -o myprogram.exe -coverpkg=`cat pkgs.txt` .
$ mkdir somedata
$ GOCOVERDIR=somedata ./myprogram.exe
$ go tool covdata percent -i=somedata
    golang.org/x/text/internal/tag  coverage: 78.4% of statements
    golang.org/x/text/language  coverage: 35.5% of statements
    mydomain.com    coverage: 100.0% of statements
    mydomain.com/greetings  coverage: 100.0% of statements
    rsc.io/quote    coverage: 25.0% of statements
    rsc.io/sampler  coverage: 86.7% of statements
$
```

--------------------------------

### Run Go Web Service

Source: https://go.dev/doc/tutorial/web-service-gin

Instructions to run a Go web service from the command line. Assumes the main.go file is in the current directory. This snippet shows the command to compile and run the Go program.

```shell
$ go run .
```

--------------------------------

### Go Type Parameter Declaration Examples

Source: https://go.dev/doc/go_spec

Provides examples of type parameter declarations used in generic functions and types in Go. These declarations specify the placeholder type names and their constraints, enabling the creation of flexible and reusable code.

```go
[P any]
[S interface{ ~[]byte|string }]
[S ~[]E, E any]
[P Constraint[int]]
[_ any]
```

--------------------------------

### Initialize 'hello' Go module

Source: https://go.dev/doc/tutorial/call-module-code

Initializes a new Go module named 'example.com/hello'. This command creates a go.mod file, enabling dependency tracking for the 'hello' module.

```shell
$ go mod init example.com/hello
go: creating new go.mod: module example.com/hello
```

--------------------------------

### Go Channel Direction Examples

Source: https://go.dev/doc/go_spec

Demonstrates how to declare channels with different directional capabilities in Go. It shows examples of bidirectional channels, send-only channels, and receive-only channels.

```go
chan T          // can be used to send and receive values of type T
chan<- float64  // can only be used to send float64s
<-chan int      // can only be used to receive ints

```

--------------------------------

### Initialize a Go Module

Source: https://go.dev/doc/code

Initializes a new Go module with a specified module path. This creates a `go.mod` file to manage dependencies. It's a fundamental step for any Go project.

```bash
mkdir hello # Alternatively, clone it if it already exists in version control.
cd hello
go mod init example/user/hello
cat go.mod
```

--------------------------------

### Go Named Interface Definition Example

Source: https://go.dev/doc/go_spec

A Go code example defining a named interface called 'Locker'. This interface requires types to implement Lock and Unlock methods.

```Go
type Locker interface {
	Lock()
	Unlock()
}

```

--------------------------------

### Go Web Server: Load Page Functionality

Source: https://go.dev/doc/articles/wiki/part3_m=text

Implements a function to load page content from a file based on its title. It uses 'os.ReadFile' and returns a Page struct or an error.

```go
func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}
```

--------------------------------

### Get Specific Dependency Version with go get

Source: https://go.dev/doc/modules/managing-dependencies

To manage specific versions of dependencies, append the desired version number or `@latest` to the module path in the `go get` command. This updates the `require` directive in your go.mod file.

```bash
$ go get example.com/theirmodule@v1.3.4

```

```bash
$ go get example.com/theirmodule@latest

```

--------------------------------

### Go Generic Function Example

Source: https://go.dev/doc/go_faq

Illustrates a generic function definition in Go using square brackets for type parameters. This highlights the syntax for defining functions that can operate on different types.

```go
type Empty struct{}

func (Empty) Nop[T any](x T) T {
    return x
}

```

--------------------------------

### Select Main Package for Go Coverage Profiling by Import Path

Source: https://go.dev/doc/build-cover

This example shows how to correctly select your main package for coverage instrumentation when it's not automatically included. It highlights the difference between using the package name 'main' and its actual import path. The snippet includes building the program and verifying coverage.

```bash
$ go list -m
mydomain.com
$ go build -coverpkg=main -o oops.exe .
warning: no packages being built depend on matches for pattern main
$ go build -coverpkg=mydomain.com -o myprogram.exe .
$ mkdir somedata
$ GOCOVERDIR=somedata ./myprogram.exe
I say "Hello, world." and "see ya"
$ go tool covdata percent -i=somedata
    mydomain.com    coverage: 100.0% of statements
$
```

--------------------------------

### Manage Go Environment Variables

Source: https://go.dev/doc/code

Demonstrates how to set and unset environment variables for the `go` tool using `go env -w` and `go env -u`. This is crucial for configuring the Go toolchain, such as specifying installation directories.

```bash
go env -w GOBIN=/somewhere/else/bin
go env -u GOBIN
```

--------------------------------

### Go Type Switch Example with Multiple Types

Source: https://go.dev/doc/go_spec

Illustrates a practical example of a Go type switch statement handling various concrete types, including nil, primitive types, function types, and a combined boolean/string case. It also shows the 'default' case.

```Go
switch i := x.(type) {
case nil:
	printString("x is nil")                // type of i is type of x (interface{})
case int:
	printInt(i)                            // type of i is int
case float64:
	printFloat64(i)                        // type of i is float64
case func(int) float64:
	printFunction(i)                       // type of i is func(int) float64
case bool, string:
	printString("type is bool or string")  // type of i is type of x (interface{})
default:
	printString("don't know the type")     // type of i is type of x (interface{})
}
```

--------------------------------

### Assembler Instruction Support (ARM 64-bit)

Source: https://go.dev/doc/go1

Details new instructions supported by the assembler for the ARM 64-bit port, enhancing the instruction set available for ARM64 development.

```armasm
    VADD
    VADDP
    VADDV
    VAND
    VCMEQ
    VDUP
    VEOR
    VLD1
    VMOV
    VMOVI
    VMOVS
    VORR
    VREV32
    VST1

```

--------------------------------

### Go Panic Example

Source: https://go.dev/doc/go_spec

Provides an example of using the built-in `panic` function in Go to signal an unrecoverable error. This is considered a terminating statement.

```Go
log.Panic("error encountered")
```

--------------------------------

### Assembler Instruction Support (PowerPC 64-bit)

Source: https://go.dev/doc/go1

Specifies the newly supported POWER9 instructions for the PowerPC 64-bit port, expanding the assembler's capabilities for this architecture.

```powerpc
    ADDEX
    CMPEQB
    COPY
    DARN
    LDMX
    MADDHD
    MADDHDU
    MADDLD
    MFVSRLD
    MTVSRDD
    MTVSRWS
    PASTECC
    VCMPNEZB
    VCMPNEZBCC
    VMSUMUDM

```

--------------------------------

### Go Build and Run Commands

Source: https://go.dev/doc/articles/wiki

Provides the command-line instructions to compile and run a Go application after code modifications, typically found in a project's README or documentation.

```bash
$ go build wiki.go
$ ./wiki
```

--------------------------------

### Go Simple Assignment Examples

Source: https://go.dev/doc/go_spec

Illustrates basic assignment operations in Go, including assigning values to variables, map elements, and dereferenced pointers.

```go
x = 1
*p = f()
a[i] = 23
(k) = <-ch  // same as: k = <-ch

```

--------------------------------

### Get Specific Commit using go get

Source: https://go.dev/doc/modules/managing-dependencies

Fetches a module from a specific commit hash in its repository. This adds a `require` directive to your go.mod file with a pseudo-version based on the commit.

```bash
$ go get example.com/theirmodule@4cf76c2
```

--------------------------------

### Go Closure and Invocation

Source: https://go.dev/doc/articles/gos_declaration_syntax

Provides an example of creating and immediately invoking a closure in Go. It highlights the concise syntax for anonymous functions.

```Go
sum := func(a, b int) int { return a+b } (3, 4)
```

--------------------------------

### Link Go Object Files into Executable

Source: https://go.dev/doc/install/gccgo

Links one or more Go object files (`file.o`) together to create an executable file (`file`). This command is used after compiling source files.

```bash
gccgo -o file file.o
```

--------------------------------

### GET /albums - List All Albums

Source: https://go.dev/doc/tutorial/web-service-gin

Retrieves a list of all albums in the collection.

```APIDOC
## GET /albums

### Description
Retrieves a list of all albums in the collection.

### Method
GET

### Endpoint
/albums

### Response
#### Success Response (200)
- **Array of Album Objects** - A list containing all album objects.

#### Response Example
```json
[
        {
                "id": "1",
                "title": "Blue Train",
                "artist": "John Coltrane",
                "price": 56.99
        },
        {
                "id": "2",
                "title": "Jeru",
                "artist": "Gerry Mulligan",
                "price": 17.99
        },
        {
                "id": "3",
                "title": "Sarah Vaughan and Clifford Brown",
                "artist": "Sarah Vaughan",
                "price": 39.99
        },
        {
                "id": "4",
                "title": "The Modern Sound of Betty Carter",
                "artist": "Betty Carter",
                "price": 49.99
        }
]
```
```

--------------------------------

### Go Module Unstable v0.x.x Version Example

Source: https://go.dev/doc/modules/release-workflow

An example of an unstable version number for a Go module. Versions in the v0.x.x range do not guarantee stability or backward compatibility, allowing for API refinement before a stable v1 release.

```go
v0.1.3
```

--------------------------------

### Go String Concatenation Examples

Source: https://go.dev/doc/go_spec

Illustrates string concatenation in Go using the '+' and '+=' operators. These operations create new strings by joining the operands. The examples show basic usage with string literals and character conversions.

```go
s := "hi" + string(c)
s += " and good bye"

```

--------------------------------

### Create Go Module for Data Access

Source: https://go.dev/doc/tutorial/database-access

Initializes a new Go module to manage project dependencies. This command creates a `go.mod` file, essential for tracking external libraries used in the project.

```bash
mkdir data-access
cd data-access
go mod init example/data-access
```

--------------------------------

### Get Specific Branch using go get

Source: https://go.dev/doc/modules/managing-dependencies

Fetches a module from a specific branch in its repository. This adds a `require` directive to your go.mod file, referencing the specified branch.

```bash
$ go get example.com/theirmodule@bugfixes
```

--------------------------------

### Go Web Server: Page Structure and Save Functionality

Source: https://go.dev/doc/articles/wiki/part3_m=text

Defines a Page struct to hold title and body content, along with a method to save the page to a file. It handles file operations using the 'os' package.

```go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore

package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}
```

--------------------------------

### Go Interface Embedding Example: io.Reader and io.Writer

Source: https://go.dev/doc/effective_go

Demonstrates how to embed the io.Reader and io.Writer interfaces to create a new io.ReadWriter interface. This approach combines the methods of the embedded interfaces into the new one. It requires the 'io' package.

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ReadWriter is the interface that combines the Reader and Writer interfaces.
type ReadWriter interface {
    Reader
    Writer
}
```

--------------------------------

### Go Iota Usage Examples

Source: https://go.dev/doc/go_spec

Shows different applications of the 'iota' identifier for generating sequential constants, including bit shifts and typed constants.

```Go
const (
	c0 = iota  // c0 == 0
	c1 = iota  // c1 == 1
	c2 = iota  // c2 == 2
)

const (
	a = 1 << iota  // a == 1  (iota == 0)
	b = 1 << iota  // b == 2  (iota == 1)
	c = 3          // c == 3  (iota == 2, unused)
	d = 1 << iota  // d == 8  (iota == 3)
)

const (
	u         = iota * 42  // u == 0     (untyped integer constant)
	v float64 = iota * 42  // v == 42.0  (float64 constant)
	w         = iota * 42  // w == 84    (untyped integer constant)
)

const x = iota  // x == 0
const y = iota  // y == 0

```

--------------------------------

### Go Package-Level Variable Initialization

Source: https://go.dev/doc/effective_go

Illustrates initializing package-level variables in Go by retrieving environment variables using os.Getenv. These variables (home, user, gopath) are common configurations for a Go project.

```go
var (
    home   = os.Getenv("HOME")
    user   = os.Getenv("USER")
    gopath = os.Getenv("GOPATH")
)
```

--------------------------------

### Adding Reviewer Instructions in Go Code

Source: https://go.dev/doc/contribute

Demonstrates how to add reviewer instructions within code comments, specifically for Go development. This is used to indicate when a change should be reviewed later, often during a new development window after a freeze period.

```go
// R=go1.12
```

--------------------------------

### Go Type Equation Example for Unification

Source: https://go.dev/doc/go_spec

Illustrates a type equation used in Go's type inference, demonstrating how bound type parameters are unified with concrete types. This example shows the initial state of the type equation and the expected outcome after unification, involving struct and array types.

```Go
type P string

[10]struct{ elem P, list []P } ≡A [10]struct{ elem string; list []string }
```

--------------------------------

### Creating and Building a Custom Go Package ('morestrings')

Source: https://go.dev/doc/code

Shows how to create a Go package named 'morestrings' with a 'ReverseRunes' function and build it using 'go build'. The function is exported as it starts with an uppercase letter, making it usable by other packages.

```go
// Package morestrings implements additional functions to manipulate UTF-8
// encoded strings, beyond what is provided in the standard "strings" package.
package morestrings

// ReverseRunes returns its argument string reversed rune-wise left to right.
func ReverseRunes(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}
```

```bash
cd $HOME/hello/morestrings
go build
```

--------------------------------

### Manage Resources with Fixed Goroutines

Source: https://go.dev/doc/effective_go

An approach that manages resources by starting a fixed number of goroutines that read from a request channel. This limits the number of simultaneous calls to `process` and allows for graceful shutdown.

```go
func handle(queue chan *Request) {
    for r := range queue {
        process(r)
    }
}

func Serve(clientRequests chan *Request, quit chan bool) {
    // Start handlers
    for i := 0; i < MaxOutstanding; i++ {
        go handle(clientRequests)
    }
    <-quit  // Wait to be told to exit.
}
```

--------------------------------

### Pprof Symbol Information and UI Update - Go

Source: https://go.dev/doc/go1

Blocking and mutex profiles generated by 'runtime/pprof' now include symbol information, enabling viewing in 'go tool pprof' without the original binary. The 'go tool pprof' visualizer has also been updated with an improved web interface.

```go
go tool pprof
```

--------------------------------

### Go Init Function for State Initialization and Validation

Source: https://go.dev/doc/effective_go

Shows a typical init function in Go used for package initialization. It checks if essential environment variables are set, provides default values if they are not, and allows overriding GOPATH via a command-line flag.

```go
func init() {
    if user == "" {
        log.Fatal("$USER not set")
    }
    if home == "" {
        home = "/home/" + user
    }
    if gopath == "" {
        gopath = home + "/go"
    }
    // gopath may be overridden by --gopath flag on command line.
    flag.StringVar(&gopath, "gopath", gopath, "override default GOPATH")
}
```

--------------------------------

### Importing a Go Database Driver (MySQL Example)

Source: https://go.dev/doc/database/open-handle

This snippet demonstrates how to import a database driver for use with the `database/sql` package. It shows both a standard import and a blank import, which is necessary when the driver is used implicitly by the `sql` package without direct function calls. It's recommended to use the `database/sql` package's functions for database operations rather than the driver's specific API.

```go
import "github.com/go-sql-driver/mysql"

```

```go
import _ "github.com/go-sql-driver/mysql"

```

--------------------------------

### Prepare and Commit Changes in a New Branch (Bash)

Source: https://go.dev/doc/contribute

Prepares changes by creating a new branch, editing files, staging them, and then committing using `git codereview change`. This command ensures changes are committed as a single commit with a Gerrit-compatible Change-Id. Dependencies include git and a configured editor.

```bash
$ git checkout -b mybranch
$ [edit files...]
$ git add [files...]
$ git codereview change   # create commit in the branch
$ [edit again...]
$ git add [files...]
$ git codereview change   # amend the existing commit with new changes
$ [etc.]
```

```bash
$ git checkout -b mybranch
$ [edit files...]
$ git add [files...]

$ git codereview change
(open $EDITOR)
```

--------------------------------

### Add Project Dependencies with go get

Source: https://go.dev/doc/modules/managing-dependencies

The `go get` command is used to add dependencies to your Go module. It can add all dependencies for the current directory or specific modules by their path. This command also ensures modules are authenticated.

```bash
$ go get .

```

```bash
$ go get example.com/theirmodule

```

--------------------------------

### Go Assembly Runtime Coordination: Function Pointers

Source: https://go.dev/doc/asm

Details how to provide pointer information for assembly functions to the Go runtime for garbage collection. Covers function prototypes, argument/result/local frame size annotations, and pseudo-instructions like `GO_RESULTS_INITIALIZED` and `NO_LOCAL_POINTERS`.

```Assembly
// TEXT directive for an assembly function
TEXT ·MyAsmFunc(SB), NOSPLIT, $0-_n_
	// If function has no arguments and no results, pointer info can be omitted.
	// For other cases, a Go prototype is required.

	// If results hold live pointers during a call, initialize them and use GO_RESULTS_INITIALIZED
	// MOVQ $0, ret_val(FP)
	// GO_RESULTS_INITIALIZED

	// If the function has no local stack frame or no calls, pointer info can be omitted.
	// Otherwise, assert no local pointers:
	// NO_LOCAL_POINTERS

	// ... function body ...

// Note: The `NOSPLIT` flag indicates no stack split, often used with functions that manage their own stack or have minimal stack usage.
// The argument/result/local frame size is indicated by the second operand of the TEXT instruction, e.g., $argsize-framesize.
```

--------------------------------

### Go Method Examples for Point Type

Source: https://go.dev/doc/go_spec

Demonstrates how to bind methods (Length, Scale) to a 'Point' type using a pointer receiver (*Point). These methods are associated with the Point type and can be called on its instances.

```go
func (p *Point) Length() float64 {
	return math.Sqrt(p.x * p.x + p.y * p.y)
}

func (p *Point) Scale(factor float64) {
	p.x *= factor
	p.y *= factor
}
```

--------------------------------

### Go Interface Method Uniqueness Example

Source: https://go.dev/doc/go_spec

Illustrates Go interface definition rules regarding method names. It shows an example of an illegal interface due to duplicate method names and a method with a blank name.

```Go
interface {
	String() string
	String() string  // illegal: String not unique
	_(x int)         // illegal: method must have non-blank name
}

```

--------------------------------

### Go Composite Literals: Array, Slice, and Map Examples

Source: https://go.dev/doc/go_spec

Demonstrates the syntax for creating composite literals for arrays, slices, and maps in Go. This includes literal initializations and common shorthands.

```Go
// same as [][]Point{[]Point{Point{0, 1}, Point{1, 2}}}
[][]Point{{0, 1}, {1, 2}}

// same as map[string]Point{"orig": Point{0, 0}}
map[string]Point{"orig": {0, 0}}

// same as map[Point]string{Point{0, 0}: "orig"}
map[Point]string{{0, 0}: "orig"}

type PPoint *Point

// same as [2]*Point{&Point{1.5, -3.5}, &Point{}}
[2]*Point{{1.5, -3.5}, {}}

// same as [2]PPoint{PPoint(&Point{1.5, -3.5}), PPoint(&Point{})}
[2]PPoint{{1.5, -3.5}, {}}

```

```Go
// list of prime numbers
primes := []int{2, 3, 5, 7, 9, 2147483647}

// vowels[ch] is true if ch is a vowel
vowels := [128]bool{'a': true, 'e': true, 'i': true, 'o': true, 'u': true, 'y': true}

// the array [10]float32{-1, 0, 0, 0, -0.1, -0.1, 0, 0, 0, -1}
filter := [10]float32{-1, 4: -0.1, -0.1, 9: -1}

// frequencies in Hz for equal-tempered scale (A4 = 440Hz)
noteFrequency := map[string]float32{
	"C0": 16.35, "D0": 18.35, "E0": 20.60, "F0": 21.83,
	"G0": 24.50, "A0": 27.50, "B0": 30.87,
}

```

--------------------------------

### Execute Go Tests with 'go test'

Source: https://go.dev/doc/code

This command sequence demonstrates how to navigate to a Go package directory and execute its tests using the `go test` command. The output shows a successful test run indicated by 'PASS'.

```bash
$ cd $HOME/hello/morestrings
$ **go test**
PASS
ok  	example/user/hello/morestrings 0.165s
$
```

--------------------------------

### Go Module Stable v1.x.x Version Example

Source: https://go.dev/doc/modules/release-workflow

An example of a stable version number for a Go module. A v1 release signifies stability and backward compatibility commitments, meaning subsequent minor and patch releases within the same major version will not break existing code.

```go
v1.0.0
```

--------------------------------

### Remove Dependency using go get @none

Source: https://go.dev/doc/modules/managing-dependencies

Removes a specific dependency from your module. The `go get` command with `@none` will remove the module and may downgrade or remove other dependencies that relied on it.

```bash
$ go get example.com/theirmodule@none
```

--------------------------------

### Go Repository Copyright Header

Source: https://go.dev/doc/contribute

This snippet provides the standard copyright header format for new files contributed to the Go repository. It includes the year, the copyright holder, and a reference to the BSD-style license.

```go
// Copyright 2025 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

```

--------------------------------

### Configure Git Aliases for Code Review

Source: https://go.dev/doc/contribute

Set up Git aliases for `git-codereview` subcommands to simplify common Git operations. These aliases should be added to your Git configuration file (e.g., `.gitconfig`) and provide shorter commands for review-related workflows.

```gitconfig
[alias]
	change = codereview change
	gofmt = codereview gofmt
	mail = codereview mail
	pending = codereview pending
	submit = codereview submit
	sync = codereview sync
```

--------------------------------

### Go Append Slice Elements Example

Source: https://go.dev/doc/effective_go

This example shows how to use the built-in append function to add multiple integer elements to an existing slice. The result is reassigned to the original slice variable as append may return a new underlying array.

```go
x := []int{1,2,3}
x = append(x, 4, 5, 6)
fmt.Println(x)
```

--------------------------------

### Make HTTP GET Request with Curl

Source: https://go.dev/doc/tutorial/web-service-gin

This command uses curl to make an HTTP GET request to a local web service running on port 8080 at the /albums endpoint. It's used to retrieve data from the running application.

```bash
$ curl http://localhost:8080/albums

```

--------------------------------

### Go Constant Declaration Examples

Source: https://go.dev/doc/go_spec

Illustrates various ways to declare constants in Go, including typed, untyped, and grouped declarations.

```Go
const Pi float64 = 3.14159265358979323846
const zero = 0.0         // untyped floating-point constant
const (
	size int64 = 1024
	eof        = -1  // untyped integer constant
)
const a, b, c = 3, 4, "foo"  // a = 3, b = 4, c = "foo", untyped integer and string constants
const u, v float32 = 0, 3    // u = 0.0, v = 3.0

```

--------------------------------

### Assembler Instruction Support (ARM 32-bit)

Source: https://go.dev/doc/go1

Lists new instructions supported by the assembler for the ARM 32-bit port. These instructions augment the capabilities for ARM architecture development.

```armasm
    BFC
    BFI
    BFX
    BFXU
    FMULAD
    FMULAF
    FMULSD
    FMULSF
    FNMULAD
    FNMULAF
    FNMULSD
    FNMULSF
    MULAD
    MULAF
    MULSD
    MULSF
    NMULAD
    NMULAF
    NMULD
    NMULF
    NMULSD
    NMULSF
    XTAB
    XTABU
    XTAH
    XTAHU

```

--------------------------------

### Go Constraint Satisfaction Rules

Source: https://go.dev/doc/go_spec

Provides examples of how different type arguments satisfy various type constraints in Go. It covers direct implementation and the special exception for comparable type constraints.

```Go
type argument      type constraint                // constraint satisfaction

int                interface{ ~int }              // satisfied: int implements interface{ ~int }
string             comparable                     // satisfied: string implements comparable (string is strictly comparable)
[]byte             comparable                     // not satisfied: slices are not comparable
any                interface{ comparable; int }   // not satisfied: any does not implement interface{ int }
any                comparable                     // satisfied: any is comparable and implements the basic interface any
struct{f any}      comparable                     // satisfied: struct{f any} is comparable and implements the basic interface any
any                interface{ comparable; m() }   // not satisfied: any does not implement the basic interface interface{ m() }
interface{ m() }   interface{ comparable; m() }   // satisfied: interface{ m() } is comparable and implements the basic interface interface{ m() }
```

--------------------------------

### Using Fprintf with ByteSlice implementing io.Writer - Go

Source: https://go.dev/doc/effective_go

Demonstrates how to use fmt.Fprintf with a ByteSlice that implements the io.Writer interface via its *ByteSlice pointer receiver. The example shows writing formatted strings into the ByteSlice, highlighting the convenience of the io.Writer interface.

```Go
var b ByteSlice
fmt.Fprintf(&b, "This hour has %d days\n", 7)

```

--------------------------------

### List Go Packages Recursively with 'go list'

Source: https://go.dev/doc/articles/go_command

This command lists the import paths for packages starting from the current directory and searching recursively through all subdirectories. It's useful for understanding the project structure.

```bash
cd $HOME/go/src
$ go list ./...
github.com/google/codesearch/cmd/cgrep
github.com/google/codesearch/cmd/cindex
github.com/google/codesearch/cmd/csearch
github.com/google/codesearch/index
github.com/google/codesearch/regexp
github.com/google/codesearch/sparse
github.com/petar/GoLLRB/example
github.com/petar/GoLLRB/llrb
$ 
```

--------------------------------

### Go AST Examples: ast.Print and ast.Inspect

Source: https://go.dev/doc/devel/weekly

Demonstrates the usage of ast.Print and ast.Inspect functions for working with Go's Abstract Syntax Tree (AST). These functions are useful for parsing and analyzing Go source code.

```go
package main

import (
	"go/ast"
	"go/parser"
	"go/token"
	"fmt"
)

func main() {
	ssrc := `package main

func main() {
	fmt.Println("Hello, AST!")
}
`
	fset := token.NewFileSet()
	// Parse the source code
	node, err := parser.ParseFile(fset, "", src, 0)
	if err != nil {
		panic(err)
	}

	// Example of ast.Print
	fmt.Println("--- ast.Print ---")
	ast.Print(fset, node)

	// Example of ast.Inspect
	fmt.Println("\n--- ast.Inspect ---")
	ast.Inspect(node, func(n ast.Node) bool {
		if n == nil {
			return true
		}
		fmt.Printf("Visiting node of type: %T\n", n)
		return true
	})
}

```

--------------------------------

### Test Go Packages with Custom Compiler

Source: https://go.dev/doc/contribute

Run tests for a specific Go package using a custom-built Go compiler. This is useful when modifying the compiler itself or standard library packages, allowing for targeted testing without a full build. Ensure you are in the package directory and have compiled the custom Go binary.

```bash
cd <MYPROJECTDIR>
$GOROOT/bin/go test
```

```bash
cd $GOROOT/src/crypto/sha1
[make changes...]
$GOROOT/bin/go test .
```

--------------------------------

### Run Go Program

Source: https://go.dev/doc/tutorial/database-access

Command to execute a Go program from the command line. Assumes the main.go file is in the current directory.

```bash
$ go run .

```

--------------------------------

### Go HTTP Handler Registration

Source: https://go.dev/doc/effective_go

Example of registering a Counter handler with the http package in Go. This attaches the Counter object to a specific URL path.

```go
import "net/http"
...
cntr := new(Counter)
http.Handle("/counter", cntr)
```

--------------------------------

### Go Pointer Type Examples

Source: https://go.dev/doc/go_spec

Illustrates the declaration of pointer types in Go. The value of an uninitialized pointer is nil.

```Go
*Point
*[4]int

```

--------------------------------

### Go Module File for Vulnerability Scanning Demo

Source: https://go.dev/doc/tutorial/govulncheck-ide

This go.mod file defines the module and its dependencies for the example Go program used in the tutorial. It specifies the Go version and requires 'golang.org/x/text' version v0.3.5.

```go.mod
module module1

go 1.18

require golang.org/x/text v0.3.5

```

--------------------------------

### Go Expression Statement Syntax and Examples

Source: https://go.dev/doc/go_spec

Defines the syntax for expression statements in Go, which allow function calls, method calls, and receive operations in a statement context. It lists built-in functions not permitted in statement context and provides valid and invalid examples.

```Go
ExpressionStmt = Expression .

// Built-in functions not permitted in statement context:
// append cap complex imag len make new real
// unsafe.Add unsafe.Alignof unsafe.Offsetof unsafe.Sizeof unsafe.Slice unsafe.SliceData unsafe.String unsafe.StringData

// Examples:
h(x+y)
f.Close()
<-ch
(<-ch)
// len("foo")  // illegal if len is the built-in function
```

--------------------------------

### Go Assignment Operation Examples

Source: https://go.dev/doc/go_spec

Demonstrates assignment operations like `<<=` and `&^=` in Go, which perform an operation and assign the result back to the original variable.

```go
a[i] <<= 2
i &=^ 1<<n

```

--------------------------------

### Uninstall Go MSI Package Silently (Windows)

Source: https://go.dev/doc/manage-install

This command line instruction silently uninstalls a Go MSI package on Windows, automatically removing associated environment variables. Replace placeholders with specific version and architecture.

```batch
msiexec /x go{{version}}.windows-{{cpu-arch}}.msi /q
```

--------------------------------

### Example Basic Counter Data

Source: https://go.dev/doc/telemetry

Illustrates how basic counters are represented, showing a counter name and its corresponding count. This format is used for tracking distinct events or occurrences.

```text
gopls/client:vscode 8
gopls/client:neovim 5
gopls/client:eglot  2

```

--------------------------------

### Go Address Operator (&) Examples

Source: https://go.dev/doc/go_spec

Demonstrates the usage of the address operator (&) in Go to obtain pointers to variables, composite literals, and indexed elements. It also shows cases that lead to runtime panics.

```Go
var x int
&x

var a []int
&a[f(2)]

&Point{2, 3}

var p *int
*p

var pf func() int
*pf(x)

var x *int = nil
// *x   // causes a run-time panic
// &*x  // causes a run-time panic
```

--------------------------------

### Run Go Internal Test Suite

Source: https://go.dev/doc/contribute

Execute the top-level Go internal test suite, which includes black-box and regression tests. This suite is typically run by `all.bash` but can be invoked manually by targeting the `cmd/internal/testdir` package.

```bash
$GOROOT/bin/go test cmd/internal/testdir
```

--------------------------------

### Manage Go Module Version Dependencies with `go get`

Source: https://go.dev/doc/toolchain

The `go get` command can manage versioned toolchain dependencies declared in the `go.mod` file. It updates the `go` and `toolchain` lines to ensure compatibility. The command can also be used to remove toolchain dependencies with `toolchain@none`.

```bash
go get go@1.22.1 toolchain@1.24rc1
go get go@1.25.0
go get toolchain@go1.22.9
go get toolchain@go1.21.3
go get toolchain@none
go get example.com/widget@v1.2.3
go mod tidy -go=1.22
go get go@1.22
```

--------------------------------

### Go: Slice Allocation with `make`

Source: https://go.dev/doc/effective_go

Shows the idiomatic way to allocate and initialize a slice in Go using the `make` function. It specifies both length and capacity.

```go
make([]int, 10, 100)

```

--------------------------------

### Example Stack Counter Data

Source: https://go.dev/doc/telemetry

Shows the format of stack counter data, which includes the counter name and the Go program's call stack at the time of incrementing. Useful for debugging crashes and rare events.

```text
crash/crash
golang.org/x/tools/gopls/internal/golang.hoverBuiltin:+22
golang.org/x/tools/gopls/internal/golang.Hover:+94
golang.org/x/tools/gopls/internal/server.Hover:+42
...

```

--------------------------------

### Go Type Conversion with Pointers

Source: https://go.dev/doc/articles/gos_declaration_syntax

Illustrates a type conversion in Go involving a pointer type, showing the necessity of parentheses for disambiguation when the type starts with '*'.

```Go
(*int)(nil)
```

--------------------------------

### Get Length and Capacity in Go

Source: https://go.dev/doc/go_spec

Use `len` and `cap` to get the length or capacity of strings, arrays, slices, maps, and channels. The result is always an `int`. For `nil` slices, maps, or channels, length and capacity are 0.

```Go
const (
	c1 = imag(2i)                    // imag(2i) = 2.0 is a constant
	c2 = len([10]float64{2})         // [10]float64{2} contains no function calls
	c3 = len([10]float64{c1})        // [10]float64{c1} contains no function calls
	c4 = len([10]float64{imag(2i)})  // imag(2i) is a constant and no function call is issued
	c5 = len([10]float64{imag(z)})   // invalid: imag(z) is a (non-constant) function call
)
var z complex128
```

--------------------------------

### List Available Tools using go tool

Source: https://go.dev/doc/modules/managing-dependencies

Displays a list of all Go tools currently available in your environment. Running `go tool` with no arguments provides this information.

```bash
$ go tool
```

--------------------------------

### reflect.Copy: String to Byte Slice/Array Copying

Source: https://go.dev/doc/go1

Shows how the reflect.Copy function now supports copying data from a string into a byte array or byte slice, mirroring the behavior of the built-in copy function.

```go
import (
    "reflect"
    "fmt"
)

func main() {
    sourceString := "Hello, world!"
    destinationBytes := make([]byte, len(sourceString))

    // Using reflect.Copy
    copiedCount := reflect.Copy(destinationBytes, reflect.ValueOf(sourceString))
    fmt.Printf("Copied %d bytes using reflect.Copy\n", copiedCount)
    fmt.Printf("Destination: %s\n", string(destinationBytes))

    // Using built-in copy for comparison
    destinationBytesBuiltin := make([]byte, len(sourceString))
    copiedCountBuiltin := copy(destinationBytesBuiltin, sourceString)
    fmt.Printf("Copied %d bytes using built-in copy\n", copiedCountBuiltin)
    fmt.Printf("Destination (builtin): %s\n", string(destinationBytesBuiltin))
}
```

--------------------------------

### Go: Defer LIFO Execution Order Example

Source: https://go.dev/doc/articles/defer_panic_recover

Illustrates that deferred function calls are executed in Last-In, First-Out (LIFO) order after the surrounding function returns.

```Go
func b() {
    for i := 0; i < 4; i++ {
        defer fmt.Print(i)
    }
}

```

--------------------------------

### Go Interface Satisfaction Example

Source: https://go.dev/doc/go_faq

Demonstrates how Go's type system requires exact signature matches for interface satisfaction. It shows that a method with a more specific receiver type does not satisfy an interface requiring a broader receiver type, and how to correctly implement an interface using type assertions.

```go
type Equaler interface {
    Equal(Equaler) bool
}

type T int
func (t T) Equal(u T) bool { return t == u } // does not satisfy Equaler

type T2 int
func (t T2) Equal(u Equaler) bool { return t == u.(T2) } // satisfies Equaler

```

--------------------------------

### Go 'comparable' Interface Examples

Source: https://go.dev/doc/go_spec

Illustrates the usage and implications of the predeclared 'comparable' interface in Go. It shows which types implement 'comparable' and highlights that interfaces themselves do not implement 'comparable' directly, but can satisfy it if they are type parameters.

```Go
int                          // implements comparable (int is strictly comparable)
[]byte                       // does not implement comparable (slices cannot be compared)
interface{}                  // does not implement comparable (see above)
interface{ ~int | ~string }  // type parameter only: implements comparable (int, string types are strictly comparable)
interface{ comparable }      // type parameter only: implements comparable (comparable implements itself)
interface{ ~int | ~[]byte }  // type parameter only: does not implement comparable (slices are not comparable)
interface{ ~struct{ any } }  // type parameter only: does not implement comparable (field any is not strictly comparable)
```

--------------------------------

### Go For Statement Variations (Condition Only, No Condition)

Source: https://go.dev/doc/go_spec

Shows equivalent 'for' loop constructs in Go. The first example demonstrates a loop that continues as long as 'cond' is true, equivalent to 'for ; cond ;'. The second example shows an infinite loop, equivalent to 'for true'.

```go
for cond { S() }    is the same as    for ; cond ; { S() }
for      { S() }    is the same as    for true     { S() }

```

--------------------------------

### Select Packages for Go Covdata Analysis

Source: https://go.dev/doc/build-cover

This example demonstrates using the `-pkg` flag with `go tool covdata percent` to filter coverage reports for specific packages. The argument to `-pkg` follows the same format as the Go command's `-coverpkg` flag. This allows for targeted analysis of coverage within selected parts of the codebase.

```shell
$ go tool covdata percent -i=somedata -pkg=mydomain.com/greetings
    mydomain.com/greetings  coverage: 100.0% of statements
$ go tool covdata percent -i=somedata -pkg=nonexistentpackage
$ 

```

--------------------------------

### Go: Defer Argument Evaluation Example

Source: https://go.dev/doc/articles/defer_panic_recover

Demonstrates that arguments to a deferred function are evaluated when the defer statement is encountered, not when the deferred function is executed.

```Go
func a() {
    i := 0
    defer fmt.Println(i)
    i++
    return
}

```

--------------------------------

### Go Struct Literal Initialization Examples

Source: https://go.dev/doc/go_spec

Demonstrates how to initialize struct composite literals in Go. Covers zero-value initialization, partial initialization using field names, and default zero values for omitted fields.

```go
type Point3D struct { x, y, z float64 }
type Line struct { p, q Point3D }

origin := Point3D{}                            // zero value for Point3D
line := Line{origin, Point3D{y: -4, z: 12.3}}  // zero value for line.q.x

```

--------------------------------

### Go Integer Literal Examples

Source: https://go.dev/doc/go_spec

Illustrates valid and invalid integer literals in Go, showcasing the use of underscores and different base prefixes (binary, octal, hexadecimal).

```Go
// Valid integer literals
42
4_2
0600
0_600
0o600
0O600       // second character is capital letter 'O'
0xBadFace
0xBad_Face
0x_67_7a_2f_cc_40_c6
170141183460469231731687303715884105727
170_141183_460469_231731_687303_715884_105727

// Invalid integer literals
_42         // an identifier, not an integer literal
42_         // invalid: _ must separate successive digits
4__2        // invalid: only one _ at a time
0_xBadFace  // invalid: _ must separate successive digits
```

--------------------------------

### Go Expression Switch Examples

Source: https://go.dev/doc/go_spec

Illustrates common usage patterns for expression switches in Go, including switches with a tag, implicit 'true' for missing expressions, and multiple conditional cases.

```go
switch tag {
default:
	s3()
case 0, 1, 2, 3:
	s1()
case 4, 5, 6, 7:
	s2()
}

switch x := f(); {  // missing switch expression means "true"
default:
	return x
case x < 0:
	return -x
}

switch {
case x < y:
	f1()
case x < z:
	f2()
case x == 4:
	f3()
}
```

--------------------------------

### Run Program in GDB

Source: https://go.dev/doc/gdb

GDB command to start or continue the execution of the debugged program. If breakpoints are set, execution will pause at the first encountered breakpoint.

```gdb
run
```

--------------------------------

### Generate Go Export Data using objcopy

Source: https://go.dev/doc/install/gccgo

Extracts the Go export data section from a compiled Go object file (`FILE.o`) and saves it into a separate file (`FILE.gox`). This `.gox` file contains metadata for package imports.

```bash
objcopy -j .go_export FILE.o FILE.gox
```

--------------------------------

### Inspect Go Compiler Assembly Output (Go)

Source: https://go.dev/doc/asm

This snippet demonstrates how to generate and view the assembly output produced by the Go compiler for a simple Go program. It utilizes the `go tool compile -S` command to display the semi-abstract instruction set.

```bash
cat x.go
package main

func main() {
	println(3)
}
$ GOOS=linux GOARCH=amd64 go tool compile -S x.go        # or: go build -gcflags -S x.go
```

```assembly
"".main STEXT size=74 args=0x0 locals=0x10
	0x0000 00000 (x.go:3)	TEXT	"".main(SB), $16-0
	0x0000 00000 (x.go:3)	MOVQ	(TLS), CX
	0x0009 00009 (x.go:3)	CMPQ	SP, 16(CX)
	0x000d 00013 (x.go:3)	JLS	67
	0x000f 00015 (x.go:3)	SUBQ	$16, SP
	0x0013 00019 (x.go:3)	MOVQ	BP, 8(SP)
	0x0018 00024 (x.go:3)	LEAQ	8(SP), BP
	0x001d 00029 (x.go:3)	FUNCDATA	$0, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x001d 00029 (x.go:3)	FUNCDATA	$1, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x001d 00029 (x.go:3)	FUNCDATA	$2, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x001d 00029 (x.go:4)	PCDATA	$0, $0
	0x001d 00029 (x.go:4)	PCDATA	$1, $0
	0x001d 00029 (x.go:4)	CALL	runtime.printlock(SB)
	0x0022 00034 (x.go:4)	MOVQ	$3, (SP)
	0x002a 00042 (x.go:4)	CALL	runtime.printint(SB)
	0x002f 00047 (x.go:4)	CALL	runtime.printnl(SB)
	0x0034 00052 (x.go:4)	CALL	runtime.printunlock(SB)
	0x0039 00057 (x.go:5)	MOVQ	8(SP), BP
	0x003e 00062 (x.go:5)	ADDQ	$16, SP
	0x0042 00066 (x.go:5)	RET
	0x0043 00067 (x.go:5)	NOP
	0x0043 00067 (x.go:3)	PCDATA	$1, $-1
	0x0043 00067 (x.go:3)	PCDATA	$0, $-1
	0x0043 00067 (x.go:3)	CALL	runtime.morestack_noctxt(SB)
	0x0048 00072 (x.go:3)	JMP	0
```

--------------------------------

### Recompile and Test Go Compiler or Internal Tools

Source: https://go.dev/doc/contribute

Recompile and test Go's internal tools like the compiler, assembler, or linker. After recompiling a specific tool (e.g., cmd/compile), use the built Go binary to build, run, or test other Go programs to verify the changes. This allows for focused testing of modified toolchain components.

```bash
cd $GOROOT/src
[make changes...]
$GOROOT/bin/go install cmd/compile
$GOROOT/bin/go build [something...]   # test the new compiler
$GOROOT/bin/go run [something...]     # test the new compiler
$GOROOT/bin/go test [something...]    # test the new compiler
```

--------------------------------

### Go Interface Type Assertion with Generic Methods

Source: https://go.dev/doc/go_faq

Demonstrates how Go's type system handles interface assertions when dealing with hypothetical generic methods. This example shows the challenges in determining which generic method implementation should be used at runtime.

```go
func TryNops(x any) {
    if x, ok := x.(interface{ Nop(string) string }); ok {
        fmt.Printf("string %s\n", x.Nop("hello"))
    }
    if x, ok := x.(interface{ Nop(int) int }); ok {
        fmt.Printf("int %d\n", x.Nop(42))
    }
    if x, ok := x.(interface{ Nop(io.Reader) io.Reader }); ok {
        data, err := io.ReadAll(x.Nop(strings.NewReader("hello world")))
        fmt.Printf("reader %q %v\n", data, err)
    }
}

```

--------------------------------

### Go Tuple Assignment Examples

Source: https://go.dev/doc/go_spec

Shows tuple assignment in Go, where multiple values are assigned to multiple variables simultaneously, either from a multi-valued expression or a list of expressions.

```go
x, y = f()

one, two, three = '一', '二', '三'

```

--------------------------------

### Go Array Type Examples

Source: https://go.dev/doc/go_spec

Illustrates various ways to define array types in Go, including multi-dimensional arrays and arrays of pointers or structs.

```Go
[32]byte
[2*N] struct { x, y int32 }
[1000]*float64
[3][5]int
[2][2][2]float64  // same as [2]([2]([2]float64))

```

--------------------------------

### Run govulncheck on a project

Source: https://go.dev/doc/tutorial/govulncheck

Executes the govulncheck tool to scan the current directory and its subdirectories for known vulnerabilities. This command analyzes the project's dependencies and code.

```bash
$ govulncheck ./...

```

--------------------------------

### Get Type of a Variable using reflect.TypeOf in Go

Source: https://go.dev/doc/articles/laws_of_reflection

Demonstrates how to use reflect.TypeOf to get the reflection Type of a Go variable. The function accepts an empty interface, allowing it to inspect any type. The output shows the static type of the variable passed.

```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    var x float64 = 3.4
    fmt.Println("type:", reflect.TypeOf(x))
}
```

--------------------------------

### Go Basic If Statement Example

Source: https://go.dev/doc/go_spec

A simple Go if statement that executes a block of code only if a condition is true.

```go
if x > max {
	x = max
}

```

--------------------------------

### Example Histogram Counter Data

Source: https://go.dev/doc/telemetry

Demonstrates the pattern for recording histogram data using counters, where bucket names indicate ranges or durations. This is commonly used for performance metrics.

```text
gopls/completion/latency:<10ms
gopls/completion/latency:<50ms
gopls/completion/latency:<100ms
...

```

--------------------------------

### Create Go Channels

Source: https://go.dev/doc/effective_go

Demonstrates how to create unbuffered and buffered channels in Go. Unbuffered channels have a default buffer size of 0, while buffered channels can be initialized with a specific capacity.

```go
ci := make(chan int)            // unbuffered channel of integers
cs := make(chan *os.File, 100)  // buffered channel of pointers to Files
```

--------------------------------

### Go Unit Test Function Signature

Source: https://go.dev/doc/go_faq

Illustrates the standard signature for a Go unit test function. Test functions must start with 'Test', accept a '*testing.T' parameter, and reside in files suffixed with '_test.go'. The 'testing' package provides utilities for test execution and reporting.

```go
import "testing"

func TestFoo(t *testing.T) {
    // Test logic here
}

```

--------------------------------

### time: Loading Time Zone Data from TZData

Source: https://go.dev/doc/go1

Demonstrates the new LoadLocationFromTZData function in the time package, which allows conversion of IANA time zone file data into a Location object for timezone handling.

```go
import (
    "time"
    "fmt"
    "os"
)

func main() {
    // Assume 'tzDataContent' is the byte slice containing IANA time zone file data (e.g., "America/New_York")
    // This could be read from a file or fetched from a source.
    tzDataContent := []byte("# This is dummy TZData content for example purposes.\nZONE \tAmerica/New_York") // Replace with actual TZData

    location, err := time.LoadLocationFromTZData("America/New_York", tzDataContent)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error loading location from TZ data: %v\n", err)
        return
    }

    now := time.Now().In(location)
    fmt.Printf("Current time in %s: %s\n", location.String(), now.Format(time.RFC1123))
}
```

--------------------------------

### Go Concurrent Prime Sieve Example

Source: https://go.dev/doc/go_spec

A complete Go program implementing a concurrent prime sieve using goroutines and channels. It includes functions for generating numbers, filtering primes, and orchestrating the sieve process.

```Go
package main

import "fmt"

// Send the sequence 2, 3, 4, … to channel 'ch'.
func generate(ch chan<- int) {
	for i := 2; ; i++ {
		ch <- i  // Send 'i' to channel 'ch'.
	}
}

// Copy the values from channel 'src' to channel 'dst',
// removing those divisible by 'prime'.
func filter(src <-chan int, dst chan<- int, prime int) {
	for i := range src {  // Loop over values received from 'src'.
		if i%prime != 0 {
			dst <- i  // Send 'i' to channel 'dst'.
		}
	}
}

// The prime sieve: Daisy-chain filter processes together.
func sieve() {
	ch := make(chan int)  // Create a new channel.
	go generate(ch)       // Start generate() as a subprocess.
	for {
		prime := <-ch
		fmt.Print(prime, "\n")
		ch1 := make(chan int)
		go filter(ch, ch1, prime)
		ch = ch1
	}
}

func main() {
	sieve()
}
```

--------------------------------

### Slice an Existing Go Slice or Array

Source: https://go.dev/doc/articles/slices_usage_and_internals

Illustrates how to create a new slice from a portion of an existing slice or array using the slicing syntax `b[start:end]`. This creates a new slice containing elements from the start index up to (but not including) the end index. The resulting slice shares the same underlying storage.

```go
b := []byte{'g', 'o', 'l', 'a', 'n', 'g'}
// b[1:4] == []byte{'o', 'l', 'a'}, sharing the same storage as b

// The start and end indices of a slice expression are optional; they default to zero and the slice’s length respectively:
// b[:2] == []byte{'g', 'o'}
// b[2:] == []byte{'l', 'a', 'n', 'g'}
// b[:] == b
```

--------------------------------

### Go Empty Interface Example

Source: https://go.dev/doc/go_spec

Demonstrates the empty interface in Go, represented by `interface{}`. This interface can hold values of any type and is aliased by the predeclared type `any`.

```Go
interface{}
// For convenience, the predeclared type `any` is an alias for the empty interface. [Go 1.18]

```

--------------------------------

### Cgo Security and Type Handling - Go

Source: https://go.dev/doc/go1

Cgo now enforces security by validating compiler options, improving type alias handling for C typedefs, and supporting direct access to Go strings from C. It also introduces new environment variables for specifying C compilers during toolchain bootstrap and updates type mapping for certain C types to uintptr, requiring initialization with 0 instead of nil.

```go
go tool fix -r cftype <pkg>
go tool fix -r jni <pkg>
```

--------------------------------

### Test Go Changes (Bash)

Source: https://go.dev/doc/contribute

Tests the changes made to the Go source code. This step ensures that the modifications do not break existing functionality. It can involve running specific package tests or all tests in the repository.

```bash
$ ./all.bash    # recompile and test
```

```bash
$ go test ./... # recompile and test
```

--------------------------------

### Context Package Import Rewrite - Go

Source: https://go.dev/doc/go1

The 'go fix' tool automatically rewrites imports from 'golang.org/x/net/context' to the standard 'context' package. This ensures compatibility and simplifies dependency management for projects using the context package.

```go
go tool fix
```

--------------------------------

### Go: Declare io.Writer variable

Source: https://go.dev/doc/go_faq

Declares a variable 'w' of type 'io.Writer'. This is a common setup for functions that expect a writer, like fmt.Fprintf.

```go
var w io.Writer
```

--------------------------------

### Get Value Representation using reflect.ValueOf in Go

Source: https://go.dev/doc/articles/laws_of_reflection

Illustrates the use of reflect.ValueOf to obtain the reflection Value of a Go variable. This function also accepts an empty interface. The String() method is used to get a string representation of the reflect.Value, distinguishing it from the default fmt behavior.

```go
var x float64 = 3.4
fmt.Println("value:", reflect.ValueOf(x).String())
```

--------------------------------

### Go Blank Identifier Assignment Examples

Source: https://go.dev/doc/go_spec

Illustrates the use of the blank identifier `_` in Go assignments to discard unwanted values from the right-hand side.

```go
_ = x       // evaluate x but ignore it
x, _ = f()  // evaluate f() but ignore second result value

```

--------------------------------

### Go Interface Illegal Type Parameter and Disjoint Set Examples

Source: https://go.dev/doc/go_spec

Provides examples of illegal interface definitions in Go due to the use of type parameters or non-disjoint type sets. This section clarifies restrictions on using type parameters directly or within unions, and the requirement for pairwise disjoint type sets in non-interface terms.

```go
interface {
	P                // illegal: P is a type parameter
	int | ~P         // illegal: P is a type parameter
	~int | MyInt     // illegal: the type sets for ~int and MyInt are not disjoint (~int includes MyInt)
	float32 | Float  // overlapping type sets but Float is an interface
}
```

--------------------------------

### Go Sqrt Function with Basic Error Handling

Source: https://go.dev/doc/articles/error_handling

An example of a function that returns an error. If the input is invalid (negative in this case), it returns a zero value and a non-nil error created with `errors.New`.

```go
func Sqrt(f float64) (float64, error) {
    if f < 0 {
        return 0, errors.New("math: square root of negative number")
    }
    // implementation
}
```

--------------------------------

### Go Generic Type Methods

Source: https://go.dev/doc/go_spec

Illustrates method declarations for generic types in Go, showing how receiver type parameters are declared and used. Example includes 'Pair' with type parameters A and B.

```go
type Pair[A, B any] struct {
	a A
	b B
}

func (p Pair[A, B]) Swap() Pair[B, A]  { ... }  // receiver declares A, B
func (p Pair[First, _]) First() First  { ... }  // receiver declares First, corresponds to A in Pair
```

--------------------------------

### Compiler Improvements

Source: https://go.dev/doc/go1

Highlights performance enhancements in the generated code across supported architectures. It also details improvements to DWARF debug information, including constant values, accurate line numbers for better source-level stepping, and distinct compilation units per package.

```go
// No direct code snippet available for compiler improvements.
// This section describes internal compiler changes affecting performance and debug information.
// For example, DWARF debug information now includes constant values and improved line number accuracy.
// 'go build -gcflags="-dwarflines"' might reveal more debug details.

```

--------------------------------

### Go Printer Examples: Variadic Function Calls and Import Path Restrictions

Source: https://go.dev/doc/devel/weekly

Illustrates how the go/printer package handles variadic function calls and enforces new import path restrictions. This is relevant for code generation and validation.

```go
package main

import (
	"go/ast"
	"go/printer"
	"go/token"
	"os"
	"fmt"
)

func main() {
	// Example demonstrating variadic function call printing
	file := &ast.File{
		Name: ast.NewIdent("main"),
		Decls: []ast.Decl{
			&ast.FuncDecl{
				Name: ast.NewIdent("myFunc"),
				Type: &ast.FuncType{
					Params: &ast.FieldList{
						List: []*ast.Field{
							{
								Names: []*ast.Ident{
									ast.NewIdent("args")
								},
								Type: &ast.Ellipsis{
									Ellipsis: token.Pos(1),
									Elt: ast.NewIdent("string"),
								},
							}
						},
				},
				Body: &ast.BlockStmt{
					List: []ast.Stmt{
						&ast.ReturnStmt{}
					}
				},
			},
		},
	}

	fset := token.NewFileSet()
	p := printer.New(os.Stdout, printer.Config{})
	fmt.Println("Printing variadic function declaration:")
	p.Fprint(fset, os.Stdout, file)

	// Note: The text mentions 'test for new import path restrictions' which would typically involve parsing code 
	// and checking for invalid import paths. This is harder to demonstrate with a simple isolated snippet 
	// without a full parsing and error-checking setup.
	fmt.Println("\n(Testing import path restrictions would involve parsing and error checking)")
}

```

--------------------------------

### Import Required Packages for Go MySQL Connection

Source: https://go.dev/doc/tutorial/database-access

This Go code shows the necessary imports for establishing a database connection. It includes the standard libraries 'database/sql', 'fmt', 'log', and 'os', along with the MySQL driver 'github.com/go-sql-driver/mysql'. The underscore import for the MySQL driver is used to satisfy the database/sql interface without directly using functions from that package in this part of the code.

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/go-sql-driver/mysql"
)
```

--------------------------------

### Synchronize Local Git Branch

Source: https://go.dev/doc/contribute

Update your local Git branch with the latest changes from the repository. This command is a shortcut provided by `git-codereview` and is equivalent to running `git pull -r`.

```bash
$ git codereview sync
```

--------------------------------

### Gccgo Version Alignment

Source: https://go.dev/doc/go1

Explains the alignment of gccgo versions with GCC releases. GCC 7 includes Go 1.8.3 of gccgo, and GCC 8 is expected to contain Go 1.10.

```text
# Gccgo version alignment with GCC releases.
# GCC 7 contains Go 1.8.3 of gccgo.
# GCC 8 is expected to contain Go 1.10 of gccgo.

```

--------------------------------

### Go Iota with Multiple Declarations per Spec

Source: https://go.dev/doc/go_spec

Illustrates how 'iota' gets the same value for multiple identifiers within the same 'ConstSpec', and how implicit repetition works.

```Go
const (
	bit0, mask0 = 1 << iota, 1<<iota - 1  // bit0 == 1, mask0 == 0  (iota == 0)
	bit1, mask1                           // bit1 == 2, mask1 == 1  (iota == 1)
	_, _                                  //                        (iota == 2, unused)
	bit3, mask3                           // bit3 == 8, mask3 == 7  (iota == 3)
)

```

--------------------------------

### Go: Import MySQL Database Driver

Source: https://go.dev/doc/tutorial/database-access

This Go code snippet shows how to import the necessary driver for connecting to a MySQL database. It includes the main package declaration and the import statement for the Go-MySQL-Driver.

```go
package main

import "github.com/go-sql-driver/mysql"

```

--------------------------------

### Submit Changes for Review (Bash)

Source: https://go.dev/doc/contribute

Sends the prepared changes for review to Gerrit. Despite the command name, it does not use email. This is the step to initiate the code review process in Gerrit. Dependencies include git and a configured codereview tool.

```bash
$ git codereview mail     # send changes to Gerrit
```

--------------------------------

### Assembler Instruction Support (X86 64-bit)

Source: https://go.dev/doc/go1

Describes the addition of 359 new instructions for the X86 64-bit port, including full AVX, AVX2, BMI, BMI2, F16C, FMA3, SSE2-SSE4.2 extensions. It also notes a change in handling `MOVL $0, AX` to avoid unexpected condition flag clearing.

```x86asm
// The x86 64-bit assembler now supports instructions from AVX, AVX2, BMI, BMI2,
// F16C, FMA3, SSE2, SSE3, SSSE3, SSE4.1, and SSE4.2 extension sets.
// Example of a new instruction (conceptual):
//    VPADDD xmm1, xmm2, xmm3

// Change in MOVL $0, AX handling:
// Previously might have been translated to XORL AX, AX, which clears flags.
// Now, it's handled to avoid clearing flags unexpectedly.

```

--------------------------------

### strings.Builder: Efficient String Accumulation

Source: https://go.dev/doc/go1

Introduces the strings.Builder type as an efficient alternative to bytes.Buffer for accumulating text into a string. Its API is a subset of bytes.Buffer, optimized to avoid data duplication.

```go
import (
    "strings"
    "fmt"
)

func main() {
    var sb strings.Builder
    sb.WriteString("This is the first part.")
    sb.WriteByte(' ')
    sb.WriteString("This is the second part.")

    finalString := sb.String()
    fmt.Println(finalString)
}
```

--------------------------------

### Go Function Literals (Closures) Examples

Source: https://go.dev/doc/go_spec

Shows how to define and use anonymous function literals (closures) in Go. These functions can capture variables from their surrounding scope.

```Go
func(a, b int, z float64) bool { return a*b < int(z) }

f := func(x, y int) int { return x + y }
func(ch chan int) { ch <- ACK }(replyChan)

```

--------------------------------

### Go Receive Operator (<-) Examples

Source: https://go.dev/doc/go_spec

Illustrates the receive operator (<-) for channels in Go. This includes basic receive operations, receiving into variables, and using the two-value receive to check channel status.

```Go
v1 := <-ch
v2 = <-ch
f(<-ch)
<-strobe  // wait until clock pulse and discard received value

x, ok = <-ch
x, ok := <-ch
var x, ok = <-ch
var x, ok T = <-ch
```

--------------------------------

### Go Generic Function Instantiation Examples

Source: https://go.dev/doc/go_spec

Illustrates the instantiation of generic functions in Go (introduced in version 1.18). It shows explicit type argument provision, type inference from context, and the use of partial type argument lists. It also highlights when explicit type arguments are required.

```Go
package main

import "fmt"

// sum returns the sum (concatenation, for strings) of its arguments.
func sum[T ~int | ~float64 | ~string](x... T) T {
	var result T
	if len(x) > 0 {
		result = x[0]
	}
	for i := 1; i < len(x); i++ {
		result += x[i]
	}
	return result
}

func apply[S ~[]E, E any](s S, f func(E) E) S {
	// This is a placeholder implementation for demonstration
	// In a real scenario, you would apply 'f' to elements of 's'
	return s
}

func main() {
	// Examples of sum function instantiation and usage
	// x := sum // illegal: the type of x is unknown

	intSum := sum[int]             // intSum has type func(x... int) int
	a := intSum(2, 3)              // a has value 5 of type int
	fmt.Println("a:", a)

	b := sum[float64](2.0, 3)      // b has value 5.0 of type float64
	fmt.Println("b:", b)

	c := sum(b, -1)                // c has value 4.0 of type float64 (type inferred)
	fmt.Println("c:", c)

	type sumFunc func(x... string) string
	var f sumFunc = sum            // same as var f sumFunc = sum[string]
	f = sum                        // same as f = sum[string]
	fmt.Println("f(\"hello\", \"world\"):", f("hello", "world"))

	// Examples of apply function instantiation and usage
	// f0 := apply[] // illegal: type argument list cannot be empty

	f1 := apply[[]int]             // type argument for S explicitly provided, type argument for E inferred
	_ = f1

	f2 := apply[[]string, string]  // both type arguments explicitly provided
	_ = f2

	var bytes []byte
	r := apply(bytes, func(byte) byte { return 0 } )  // both type arguments inferred from the function arguments
	fmt.Println("r (inferred apply):", r)
}

```

--------------------------------

### Go Floating-Point Literal Examples

Source: https://go.dev/doc/go_spec

Demonstrates valid and invalid floating-point literals in Go, including decimal and hexadecimal formats with various exponent notations and underscore usage for readability.

```Go
// Valid floating-point literals
0.
72.40
072.40       // == 72.40
2.71828
1.e+0
6.67428e-11
1E6
.25
.12345E+5
1_5.         // == 15.0
0.15e+0_2    // == 15.0

0x1p-2       // == 0.25
0x2.p10      // == 2048.0
0x1.Fp+0     // == 1.9375
0X.8p-0      // == 0.5
0X_1FFFP-16  // == 0.1249847412109375
0x15e-2      // == 0x15e - 2 (integer subtraction)

// Invalid floating-point literals
0x.p1        // invalid: mantissa has no digits
1p-2         // invalid: p exponent requires hexadecimal mantissa
0x1.5e-2     // invalid: hexadecimal mantissa requires p exponent
1_.5         // invalid: _ must separate successive digits
1._5         // invalid: _ must separate successive digits
1.5_e1       // invalid: _ must separate successive digits
1.5e_1       // invalid: _ must separate successive digits
1.5e1_       // invalid: _ must separate successive digits
```

--------------------------------

### Link with Runtime Path (RPAth) using gccgo

Source: https://go.dev/doc/install/gccgo

Links Go object files into an executable while embedding the runtime library search path directly into the executable using the `-Wl,-R` linker option. This avoids the need for `LD_LIBRARY_PATH`.

```bash
go build -gccgoflags -Wl,-R,${prefix}/lib/gcc/MACHINE/VERSION
[or]
gccgo -o file file.o -Wl,-R,${prefix}/lib/gcc/MACHINE/VERSION
```

--------------------------------

### Revise and Resubmit Changes with Git Codereview

Source: https://go.dev/doc/contribute

Amends the current commit with further changes and resubmits them to Gerrit. This is used to incorporate feedback received during the code review process.

```shell
$ git codereview change     # amend current commit
(open $EDITOR)
$ git codereview mail       # send new changes to Gerrit

```

--------------------------------

### Add Album via Curl POST Request

Source: https://go.dev/doc/tutorial/web-service-gin

Example of using curl to make a POST request to add a new album to the running Go web service. It specifies the URL, headers, request method, and JSON data for the new album.

```shell
$ curl http://localhost:8080/albums \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"id": "4","title": "The Modern Sound of Betty Carter","artist": "Betty Carter","price": 49.99}'
```

--------------------------------

### Go Invalid Alias Declaration

Source: https://go.dev/doc/go_spec

Shows an example of an illegal alias declaration where the type parameter is used as the underlying type.

```Go
type A[P any] = P    // illegal: P is a type parameter

```

--------------------------------

### Go If Statement with Simple Statement and Else If

Source: https://go.dev/doc/go_spec

An example of a Go if statement that includes a simple statement before the condition, and demonstrates the use of `else if` and `else` blocks for more complex conditional logic.

```go
if x := f(); x < y {
	return x
} else if x > z {
	return z
} else {
	return y
}

```

--------------------------------

### Go Generic Type Switch Example

Source: https://go.dev/doc/go_spec

Demonstrates a type switch within a generic Go function. It shows how type parameters and generic types can be used in cases and how type duplication is handled by selecting the first matching case.

```Go
func f[P any](x any) int {
	switch x.(type) {
	case P:
		return 0
	case string:
		return 1
	case []P:
		return 2
	case []byte:
		return 3
	default:
		return 4
	}
}

var v1 = f[string]("foo")   // v1 == 0
var v2 = f[byte]([]byte{})  // v2 == 2
```

--------------------------------

### Gofmt Formatting Changes

Source: https://go.dev/doc/go1

Describes minor formatting adjustments in gofmt, specifically for complex slice expressions and single-line interface literals. It advises against systems that rigidly check gofmt versions and recommends invoking the same gofmt binary for consistency.

```go
package main

import (
	"fmt"
	"go/format"
)

func main() {
	// Example of a complex slice expression
	sdata := []int{1, 2, 3, 4, 5}
	formattedSlice := data[1+1 : 2 : 3]
	fmt.Println(formattedSlice)

	// Example of a single-method interface literal
	var r io.Reader
	r = (*os.File)(nil)

	// gofmt will format these consistently
}

```

--------------------------------

### Go os.StartProcess Argument Update

Source: https://go.dev/doc/devel/weekly

Shows the updated signature for `os.StartProcess`. The final three arguments (environment, directory, file descriptors) are now passed as a pointer to an `os.ProcAttr` struct, simplifying the function call.

```Go
os.StartProcess(bin, args, &os.ProcAttr{Files: fds, Dir: dir, Env: env})
```

--------------------------------

### Go Import Access Examples

Source: https://go.dev/doc/go_spec

Illustrates how imported package identifiers are accessed locally based on the type of import declaration used. This includes direct imports, aliased imports, and dot imports.

```Go
import   "lib/math"         math.Sin
import m "lib/math"         m.Sin
import . "lib/math"         Sin
```

--------------------------------

### Go Type Documentation: Concurrency Guarantees

Source: https://go.dev/doc/comment

Demonstrates how to document concurrency guarantees for a Go type. If a type is safe for concurrent use, this should be explicitly stated. This example explains that a Regexp type is safe for concurrent use, with exceptions for configuration methods.

```go
package regexp

// Regexp is the representation of a compiled regular expression.
// A Regexp is safe for concurrent use by multiple goroutines,
// except for configuration methods, such as Longest.
type Regexp struct {
    ...
}
```

--------------------------------

### Go Simple Slice Expression Example with Array

Source: https://go.dev/doc/go_spec

Illustrates how a simple slice expression on an array in Go results in a new slice with a specific length and capacity. It shows accessing elements of the resulting slice.

```Go
a := [5]int{1, 2, 3, 4, 5}
s := a[1:4]

// s has type []int, length 3, capacity 4, and elements:
s[0] == 2
s[1] == 3
s[2] == 4
```

--------------------------------

### Fetch and Checkout Remote Code Changes

Source: https://go.dev/doc/contribute

Fetch specific changes from a remote repository and check them out locally. This is used to import code proposed by another developer for review or testing, typically following instructions from a code review platform like Gerrit.

```bash
$ git fetch https://go.googlesource.com/review refs/changes/21/13245/1 && git checkout FETCH_HEAD
```

--------------------------------

### Go unsafe Pointer Conversion Example

Source: https://go.dev/doc/go_spec

Demonstrates converting a float64 to its uint64 bit representation using unsafe.Pointer. This highlights the ability to bypass type safety for direct memory manipulation.

```go
var f float64
bits = *(*uint64)(unsafe.Pointer(&f))
```

--------------------------------

### Go Conversion Syntax Example

Source: https://go.dev/doc/go_spec

Illustrates the basic syntax for explicit type conversions in Go, using `T(x)` where `T` is the target type and `x` is the expression to convert. This is the fundamental way to change an expression's type.

```Go
Conversion = Type "(" Expression [ "," ] ")" .
```

--------------------------------

### Basic Formatted Printing in Go

Source: https://go.dev/doc/effective_go

Demonstrates equivalent formatted printing outputs using `fmt.Printf`, `fmt.Fprint`, and `fmt.Println`. These functions offer different ways to achieve the same output, with `Printf` using format specifiers, `Fprint` writing to an `io.Writer`, and `Println` adding spaces and newlines by default.

```go
fmt.Printf("Hello %d\n", 23)
fmt.Fprint(os.Stdout, "Hello ", 23, "\n")
fmt.Println("Hello", 23)
fmt.Println(fmt.Sprint("Hello ", 23))
```

--------------------------------

### Go Directive Comment Example

Source: https://go.dev/doc/comment

Shows how directive comments, like `//go:generate`, are handled in Go doc comments. Gofmt moves these directives to the end of the doc comment, separated by a blank line.

```Go
package regexp

// An Op is a single regular expression operator.
//
//go:generate stringer -type Op -trimprefix Op
type Op uint8

```

--------------------------------

### Go Composite Literal Pointer Example

Source: https://go.dev/doc/go_spec

Shows how to take the address of a composite literal in Go to obtain a pointer to a uniquely initialized variable. This is useful for creating variables that are directly addressable.

```go
var pointer *Point3D = &Point3D{y: 1000}

```

--------------------------------

### Go Assembly PCALIGN Pseudo-Instruction for Code Alignment

Source: https://go.dev/doc/asm

Pads instructions with no-ops to align the next instruction to a specified byte boundary. Supported on multiple architectures, it ensures code alignment for performance or specific hardware requirements.

```goasm
PCALIGN $32
MOVD $2, R0

```

--------------------------------

### Test Go Packages Recursively with 'go test'

Source: https://go.dev/doc/articles/go_command

This command runs the tests for all packages found recursively starting from the current directory. It reports the status of each test suite, indicating whether they passed or failed.

```bash
$ go test ./...
?   	github.com/google/codesearch/cmd/cgrep	[no test files]
?   	github.com/google/codesearch/cmd/cindex	[no test files]
?   	github.com/google/codesearch/cmd/csearch	[no test files]
ok  	github.com/google/codesearch/index	0.203s
ok  	github.com/google/codesearch/regexp	0.017s
?   	github.com/google/codesearch/sparse	[no test files]
?       github.com/petar/GoLLRB/example	[no test files]
ok      github.com/petar/GoLLRB/llrb	0.231s
$ 
```

--------------------------------

### Go Concurrent HTTP URL Poller

Source: https://go.dev/doc/codewalk_fileprint=%2Fdoc%2Fcodewalk%2Furlpoll

This Go code defines a system for concurrently polling HTTP URLs. It uses goroutines to perform polling operations and a StateMonitor to track and log the status of each URL. The system manages a list of URLs, polls them at a set interval, and reports their status. Dependencies include the standard 'log', 'net/http', and 'time' packages.

```go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"
	"net/http"
	"time"
)

const (
	numPollers     = 2                // number of Poller goroutines to launch
	pollInterval   = 60 * time.Second // how often to poll each URL
	statusInterval = 10 * time.Second // how often to log status to stdout
	errTimeout     = 10 * time.Second // back-off timeout on error
)

var urls = []string{
	"http://www.google.com/",
	"http://golang.org/",
	"http://blog.golang.org/",
}

// State represents the last-known state of a URL.
type State struct {
	url    string
	status string
}

// StateMonitor maintains a map that stores the state of the URLs being
// polled, and prints the current state every updateInterval nanoseconds.
// It returns a chan State to which resource state should be sent.
func StateMonitor(updateInterval time.Duration) chan<- State {
	updates := make(chan State)
	urlStatus := make(map[string]string)
	ticker := time.NewTicker(updateInterval)
	go func() {
		for {
			select {
			case <-ticker.C:
				logState(urlStatus)
			case s := <-updates:
				urlStatus[s.url] = s.status
			}
		}
	}()
	return updates
}

// logState prints a state map.
func logState(s map[string]string) {
	log.Println("Current state:")
	for k, v := range s {
		log.Printf(" %s %s", k, v)
	}
}

// Resource represents an HTTP URL to be polled by this program.
type Resource struct {
	url      string
	errCount int
}

// Poll executes an HTTP HEAD request for url
// and returns the HTTP status string or an error string.
func (r *Resource) Poll() string {
	resp, err := http.Head(r.url)
	if err != nil {
		log.Println("Error", r.url, err)
		r.errCount++
		return err.Error()
	}
	r.errCount = 0
	return resp.Status
}

// Sleep sleeps for an appropriate interval (dependent on error state)
// before sending the Resource to done.
func (r *Resource) Sleep(done chan<- *Resource) {
	time.Sleep(pollInterval + errTimeout*time.Duration(r.errCount))
	done <- r
}

func Poller(in <-chan *Resource, out chan<- *Resource, status chan<- State) {
	for r := range in {
		s := r.Poll()
		status <- State{r.url, s}
		out <- r
	}
}

func main() {

	// Create our input and output channels.

pending, complete := make(chan *Resource), make(chan *Resource)


	// Launch the StateMonitor.
	status := StateMonitor(statusInterval)

	// Launch some Poller goroutines.
	for i := 0; i < numPollers; i++ {
		go Poller(pending, complete, status)
	}

	// Send some Resources to the pending queue.
	go func() {
		for _, url := range urls {
			pending <- &Resource{url: url}
		}
	}()

	for r := range complete {
		go r.Sleep(pending)
	}
}

```

--------------------------------

### Check Git Email Configuration

Source: https://go.dev/doc/contribute

Checks the current global and local Git configuration for the user's email address. This is crucial for ensuring commits are associated with the correct Google account for contributions.

```bash
git config --global user.email  # check current global config
git config user.email           # check current local config

```

--------------------------------

### Go Constant Flexibility Example

Source: https://go.dev/doc/go_faq

Demonstrates how Go constants, unlike variables, are more flexible with conversions and precision. Literal constants can exist in an ideal number space until assigned to a variable, at which point they become computer numbers with standard floating-point properties. This flexibility allows for operations like safely converting a literal number to a float64 for function calls.

```go
sqrt2 := math.Sqrt(2)

```

--------------------------------

### Go Main Function with Handlers

Source: https://go.dev/doc/articles/wiki

Demonstrates how to register Go web handlers using the http.HandleFunc function, wrapping custom handlers with a closure-based makeHandler function.

```go
func main() {
    http.HandleFunc("/view/", makeHandler(viewHandler))
    http.HandleFunc("/edit/", makeHandler(editHandler))
    http.HandleFunc("/save/", makeHandler(saveHandler))

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

--------------------------------

### Go Method Values: Interface Receiver Example

Source: https://go.dev/doc/go_spec

Illustrates creating a method value from an interface type. The behavior is similar to non-interface types, where `i.M` creates a function value that can be called later.

```go
var i interface { M(int) } = myVal
f := i.M; f(7)  // like i.M(7)

```

--------------------------------

### Go Select Statement Example with Multiple Cases

Source: https://go.dev/doc/go_spec

Demonstrates a 'select' statement in Go with various communication operations including receiving into variables, sending values, receiving with a boolean check for channel closure, and a default case.

```Go
var a []int
var c, c1, c2, c3, c4 chan int
var i1, i2 int
select {
case i1 = <-c1:
	print("received ", i1, " from c1\n")
case c2 <- i2:
	print("sent ", i2, " to c2\n")
case i3, ok := (<-c3):  // same as: i3, ok := <-c3
	if ok {
		print("received ", i3, " from c3\n")
	} else {
		print("c3 is closed\n")
	}
case a[f()] = <-c4:
	// same as:
	// case t := <-c4
	//	sa[f()] = t
default:
	print("no communication\n")
}

```

--------------------------------

### Inspect Linked Binary Assembly (Go)

Source: https://go.dev/doc/asm

This snippet shows how to examine the machine code instructions within a compiled Go executable using `go tool objdump`. This is useful for understanding the final binary representation after linking, contrasting with the compiler's semi-abstract output.

```bash
$ go build -o x.exe x.go
$ go tool objdump -s main.main x.exe
```

```assembly
TEXT main.main(SB) /tmp/x.go
  x.go:3		0x10501c0		65488b0c2530000000	MOVQ GS:0x30, CX
  x.go:3		0x10501c9		483b6110		CMPQ 0x10(CX), SP
  x.go:3		0x10501cd		7634			JBE 0x1050203
  x.go:3		0x10501cf		4883ec10		SUBQ $0x10, SP
  x.go:3		0x10501d3		48896c2408		MOVQ BP, 0x8(SP)
  x.go:3		0x10501d8		488d6c2408		LEAQ 0x8(SP), BP
  x.go:4		0x10501dd		e86e45fdff		CALL runtime.printlock(SB)
  x.go:4		0x10501e2		48c7042403000000	MOVQ $0x3, 0(SP)
  x.go:4		0x10501ea		e8e14cfdff		CALL runtime.printint(SB)
  x.go:4		0x10501ef		e8ec47fdff		CALL runtime.printnl(SB)
  x.go:4		0x10501f4		e8d745fdff		CALL runtime.printunlock(SB)
  x.go:5		0x10501f9		488b6c2408		MOVQ 0x8(SP), BP
  x.go:5		0x10501fe		4883c410		ADDQ $0x10, SP
  x.go:5		0x1050202		c3			RET
  x.go:3		0x1050203		e83882ffff		CALL runtime.morestack_noctxt(SB)
  x.go:3		0x1050208		ebb6			JMP main.main(SB)
```

--------------------------------

### Go Example Call to Generic Sum Function with Type Arguments

Source: https://go.dev/doc/tutorial/generics

This Go code demonstrates calling the generic `SumIntsOrFloats` function. It explicitly provides type arguments (`string` for the key type and `int64` or `float64` for the value type) to specify how the function should be instantiated. The results for both integer and float maps are then printed.

```go
fmt.Printf("Generic Sums: %v and %v\n",
    SumIntsOrFloats[string, int64](ints),
    SumIntsOrFloats[string, float64](floats))

```

--------------------------------

### Go Database Operations: Album Management

Source: https://go.dev/doc/tutorial/database-access

This Go code snippet demonstrates how to connect to a MySQL database, define an Album struct, and perform CRUD operations. It includes functions to fetch albums by artist, retrieve a single album by its ID, and add a new album. Dependencies include the standard Go database/sql package and the go-sql-driver/mysql driver. It expects database connection details via environment variables.

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Album struct {
    ID     int64
    Title  string
    Artist string
    Price  float32
}

func main() {
    // Capture connection properties.
    cfg := mysql.NewConfig()
    cfg.User = os.Getenv("DBUSER")
    cfg.Passwd = os.Getenv("DBPASS")
    cfg.Net = "tcp"
    cfg.Addr = "127.0.0.1:3306"
    cfg.DBName = "recordings"

    // Get a database handle.
    var err error
    db, err = sql.Open("mysql", cfg.FormatDSN())
    if err != nil {
        log.Fatal(err)
    }

    pingErr := db.Ping()
    if pingErr != nil {
        log.Fatal(pingErr)
    }
    fmt.Println("Connected!")

    albums, err := albumsByArtist("John Coltrane")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Albums found: %v\n", albums)

    // Hard-code ID 2 here to test the query.
    alb, err := albumByID(2)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Album found: %v\n", alb)

    albID, err := addAlbum(Album{
        Title:  "The Modern Sound of Betty Carter",
        Artist: "Betty Carter",
        Price:  49.99,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("ID of added album: %v\n", albID)
}

// albumsByArtist queries for albums that have the specified artist name.
func albumsByArtist(name string) ([]Album, error) {
    // An albums slice to hold data from returned rows.
    var albums []Album

    rows, err := db.Query("SELECT * FROM album WHERE artist = ?", name)
    if err != nil {
        return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
    }
    defer rows.Close()
    // Loop through rows, using Scan to assign column data to struct fields.
    for rows.Next() {
        var alb Album
        if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
            return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
        }
        albums = append(albums, alb)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
    }
    return albums, nil
}

// albumByID queries for the album with the specified ID.
func albumByID(id int64) (Album, error) {
    // An album to hold data from the returned row.
    var alb Album

    row := db.QueryRow("SELECT * FROM album WHERE id = ?", id)
    if err := row.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
        if err == sql.ErrNoRows {
            return alb, fmt.Errorf("albumsById %d: no such album", id)
        }
        return alb, fmt.Errorf("albumsById %d: %v", id, err)
    }
    return alb, nil
}

// addAlbum adds the specified album to the database,
// returning the album ID of the new entry
func addAlbum(alb Album) (int64, error) {
    result, err := db.Exec("INSERT INTO album (title, artist, price) VALUES (?, ?, ?)", alb.Title, alb.Artist, alb.Price)
    if err != nil {
        return 0, fmt.Errorf("addAlbum: %v", err)
    }
    id, err := result.LastInsertId()
    if err != nil {
        return 0, fmt.Errorf("addAlbum: %v", err)
    }
    return id, nil
}

```

--------------------------------

### Go unsafe Alignof Example

Source: https://go.dev/doc/go_spec

Shows how to check memory alignment using unsafe.Alignof. It asserts that the address of a variable modulo its alignment is zero, which is a requirement for aligned memory access.

```go
uintptr(unsafe.Pointer(&x)) % unsafe.Alignof(x) == 0
```

--------------------------------

### Go Grouped Variables Declaration Example

Source: https://go.dev/doc/comment

Demonstrates documenting a group of related variables in Go using a single doc comment. This is useful for variables that represent a set of related values or errors.

```Go
package fs

// Generic file system errors.
// Errors returned by file systems can be tested against these errors
// using errors.Is.
var (
    ErrInvalid    = errInvalid()    // "invalid argument"
    ErrPermission = errPermission() // "permission denied"
    ErrExist      = errExist()      // "file already exists"
    ErrNotExist   = errNotExist()   // "file does not exist"
    ErrClosed     = errClosed()     // "file already closed"
)

```

--------------------------------

### Go HTTP Poller and State Monitor

Source: https://go.dev/doc/codewalk/urlpoll_m=text

This Go program implements a concurrent HTTP poller. It uses goroutines to poll a list of URLs, sends their status to a StateMonitor, and handles errors by introducing back-off delays. The StateMonitor aggregates the status of all URLs and logs it at regular intervals. Dependencies include the 'log', 'net/http', and 'time' packages.

```go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"
	"net/http"
	"time"
)

const (
	numPollers     = 2                // number of Poller goroutines to launch
	pollInterval   = 60 * time.Second // how often to poll each URL
	statusInterval = 10 * time.Second // how often to log status to stdout
	errTimeout     = 10 * time.Second // back-off timeout on error
)

var urls = []string{
	"http://www.google.com/",
	"http://golang.org/",
	"http://blog.golang.org/",
}

// State represents the last-known state of a URL.
type State struct {
	url    string
	status string
}

// StateMonitor maintains a map that stores the state of the URLs being
// polled, and prints the current state every updateInterval nanoseconds.
// It returns a chan State to which resource state should be sent.
func StateMonitor(updateInterval time.Duration) chan<- State {
	updates := make(chan State)
	urlStatus := make(map[string]string)
	ticker := time.NewTicker(updateInterval)
	go func() {
		for {
			select {
			case <-ticker.C:
				logState(urlStatus)
			case s := <-updates:
				urlStatus[s.url] = s.status
			}
		}
	}()
	return updates
}

// logState prints a state map.
func logState(s map[string]string) {
	log.Println("Current state:")
	for k, v := range s {
		log.Printf(" %s %s", k, v)
	}
}

// Resource represents an HTTP URL to be polled by this program.
type Resource struct {
	url      string
	errCount int
}

// Poll executes an HTTP HEAD request for url
// and returns the HTTP status string or an error string.
func (r *Resource) Poll() string {
	resp, err := http.Head(r.url)
	if err != nil {
		log.Println("Error", r.url, err)
		r.errCount++
		return err.Error()
	}
	r.errCount = 0
	return resp.Status
}

// Sleep sleeps for an appropriate interval (dependent on error state)
// before sending the Resource to done.
func (r *Resource) Sleep(done chan<- *Resource) {
	time.Sleep(pollInterval + errTimeout*time.Duration(r.errCount))
	done <- r
}

func Poller(in <-chan *Resource, out chan<- *Resource, status chan<- State) {
	for r := range in {
		s := r.Poll()
		status <- State{r.url, s}
		out <- r
	}
}

func main() {
	// Create our input and output channels.

pending, complete := make(chan *Resource), make(chan *Resource)

	// Launch the StateMonitor.
	status := StateMonitor(statusInterval)

	// Launch some Poller goroutines.
	for i := 0; i < numPollers; i++ {
		go Poller(pending, complete, status)
	}

	// Send some Resources to the pending queue.
	go func() {
		for _, url := range urls {
			pending <- &Resource{url: url}
		}
	}()

	for r := range complete {
		go r.Sleep(pending)
	}
}

```

--------------------------------

### Imaginary Literals Examples in Go

Source: https://go.dev/doc/go_spec

Illustrates various valid and backward-compatible forms of imaginary literals in Go. It shows how integer and floating-point literals combined with 'i' form complex number components.

```go
0i
0123i         // == 123i for backward-compatibility
0o123i        // == 0o123 * 1i == 83i
0xabci        // == 0xabc * 1i == 2748i
0.
i
2.71828i
1.e+0i
6.67428e-11i
1E6i
.25i
.12345E+5i
0x1p-2i       // == 0x1p-2 * 1i == 0.25i
```

--------------------------------

### Go Interface Variable Assignment Examples

Source: https://go.dev/doc/go_spec

Demonstrates assigning different types of values to a variable of interface type in Go. It shows how the dynamic type of the interface variable changes with assignments, including nil values.

```go
var x interface{}  // x is nil and has static type interface{}
var v *T           // v has value nil, static type *T
x = 42             // x has value 42 and dynamic type int
x = v              // x has value (*T)(nil) and dynamic type *T

```

--------------------------------

### Get Number of CPU Cores in Go

Source: https://go.dev/doc/effective_go

Provides Go code snippets to dynamically determine the number of available hardware CPU cores. It shows how to use 'runtime.NumCPU()' and 'runtime.GOMAXPROCS(0)' for this purpose.

```Go
var numCPU = runtime.NumCPU()

```

```Go
var numCPU = runtime.GOMAXPROCS(0)

```

--------------------------------

### Create a Go Slice with `make`

Source: https://go.dev/doc/articles/slices_usage_and_internals

Demonstrates creating a Go slice of bytes using the `make` function. The `make` function allocates an underlying array and returns a slice that refers to it. The example shows specifying both length and capacity, and a more concise version where capacity defaults to length.

```go
var s []byte
s = make([]byte, 5, 5)
// s == []byte{0, 0, 0, 0, 0}

// When the capacity argument is omitted, it defaults to the specified length:
s := make([]byte, 5)

// The length and capacity of a slice can be inspected using the built-in len and cap functions.
// len(s) == 5
// cap(s) == 5
```

--------------------------------

### Manage Go Module Dependencies

Source: https://go.dev/doc/tutorial/govulncheck

Commands to update and manage dependencies in a Go module. `go mod tidy` adds missing and removes unused dependencies, while `go get` can be used to fetch specific versions, including downgrading to older, potentially vulnerable ones for demonstration.

```bash
$ go mod tidy

```

```bash
$ go get golang.org/x/text@v0.3.5

```

--------------------------------

### HTTP FileServer with FileSystem Interface (Go)

Source: https://go.dev/doc/devel/weekly

Shows the updated http package's `FileServer` helper, which now accepts a `FileSystem` interface instead of an explicit file system root. This allows serving arbitrary data by implementing a custom `FileSystem`.

```Go
// New signature:
// http.FileServer(fs http.FileSystem)

// Example of a custom FileSystem implementation (conceptual):
// type myFileSystem struct {}
// func (fs myFileSystem) Open(name string) (http.File, error) { ... }
// handler := http.FileServer(myFileSystem{})
// http.Handle("/files/", handler)
```

--------------------------------

### Go Grouped Constants Declaration Example

Source: https://go.dev/doc/comment

Demonstrates how to declare a group of related constants in Go using a single doc comment. This approach is useful for constants that belong together logically, such as token types.

```Go
package scanner // import "text/scanner"

// The result of Scan is one of these tokens or a Unicode character.
const (
    EOF = -(iota + 1)
    Ident
    Int
    Float
    Char
    ...
)

```

--------------------------------

### HTML Edit Form Template

Source: https://go.dev/doc/articles/wiki

This is an example of an HTML template file ('edit.html') used for editing page content. It includes a form with a textarea for the body and a submit button, utilizing template directives like {{.Title}} and {{printf "%s" .Body}}.

```html
<h1>Editing {{.Title}}</h1>

<form action="/save/{{.Title}}" method="POST">
<div><textarea name="body" rows="20" cols="80">{{printf "%s" .Body}}</textarea></div>
<div><input type="submit" value="Save"></div>
</form>
```

--------------------------------

### Clone Go Project Repository using Git

Source: https://go.dev/doc/articles/go_command

This command demonstrates how to clone a Go project repository from GitHub. The import path for the package is derived from this URL.

```bash
git clone https://github.com/golang/glog

```

--------------------------------

### Go Nested Composite Literal Examples

Source: https://go.dev/doc/go_spec

Shows how composite literals can be nested within each other in Go. Demonstrates eliding the type for nested composite literals when the type is identical to the element or key type.

```go
[...]Point{{1.5, -3.5}, {0, 0}}     // same as [...]Point{Point{1.5, -3.5}, Point{0, 0}}
[][]int{{1, 2, 3}, {4, 5}}          // same as [][]int{[]int{1, 2, 3}, []int{4, 5}}

```

--------------------------------

### Set Go Cross-Compilation Environment Variables (Bash)

Source: https://go.dev/doc/install/source

This snippet demonstrates how to set the GOARCH and GOOS environment variables in a Bash shell profile for cross-compilation. These variables specify the target architecture and operating system for the Go compiler.

```bash
export GOARCH=amd64
export GOOS=linux
```

--------------------------------

### rand.Reader Usage in crypto/tls Cert Generation

Source: https://go.dev/doc/devel/weekly

The example for certificate generation in the crypto/tls package now uses rand.Reader. This ensures cryptographically secure random number generation for certificate parameters.

```Go
import (
    "crypto/rand"
    "crypto/tls"
)

// ... example usage using rand.Reader ...
```

--------------------------------

### Add Tool Dependency using go get -tool

Source: https://go.dev/doc/modules/managing-dependencies

Adds a development tool as a dependency for your module. This command, available in Go 1.24+, adds a `tool` directive to your go.mod file.

```bash
$ go get -tool golang.org/x/tools/cmd/stringer
```

--------------------------------

### Go: `Filter` Function Using `append`

Source: https://go.dev/doc/articles/slices_usage_and_internals

An example of a `Filter` function that iterates through a slice of integers and appends elements satisfying a given predicate function `fn` to a new slice.

```Go
// Filter returns a new slice holding only
// the elements of s that satisfy fn()
func Filter(s []int, fn func(int) bool) []int {
    var p []int // == nil
    for _, v := range s {
        if fn(v) {
            p = append(p, v)
        }
    }
    return p
}
```

--------------------------------

### Go unsafe Offsetof Example

Source: https://go.dev/doc/go_spec

Verifies the correctness of unsafe.Offsetof by demonstrating that the address of a struct field plus the offset equals the address of the field itself. This is fundamental for struct memory layout calculations.

```go
uintptr(unsafe.Pointer(&s)) + unsafe.Offsetof(s.f) == uintptr(unsafe.Pointer(&s.f))
```

--------------------------------

### Setting GODEBUG Environment Variable in Go

Source: https://go.dev/doc/godebug

Demonstrates how to set the GODEBUG environment variable to control specific Go program behaviors. This example disables HTTP/2 for both client and server by setting their respective GODEBUG values to '0'. Unrecognized settings are ignored.

```shell
GODEBUG=http2client=0,http2server=0
```

--------------------------------

### Go Assembly Runtime Coordination: Data Symbols

Source: https://go.dev/doc/asm

Explains how to define data symbols in Go assembly for garbage collection. Covers flags like `NOPTR` and `RODATA`, and the limitations on defining pointer-containing symbols in assembly.

```Assembly
// Example: Defining a read-only data symbol
DATA "my_string",RODATA

// Example: Defining a data symbol with no pointers
DATA "my_data",NOPTR

// Note: Symbols containing pointers must be defined in Go source files.
// Assembly can refer to them by name using GLOBL directive.
```

--------------------------------

### Go Simple Slice Expression Syntax

Source: https://go.dev/doc/go_spec

Demonstrates the basic syntax for creating slices or substrings in Go using the `a[low:high]` notation. It shows how omitting indices defaults to the start or end of the operand.

```Go
a[low : high]
a[2:]  // same as a[2 : len(a)]
a[:3]  // same as a[0 : 3]
a[:]   // same as a[0 : len(a)]
```

--------------------------------

### Go Type Assertion Example

Source: https://go.dev/doc/go_spec

Demonstrates basic type assertion in Go. It shows how to assert the type of an interface variable and extract its underlying value. If the assertion fails, it will cause a run-time panic.

```go
var x interface{} = 7          // x has dynamic type int and value 7
i := x.(int)                   // i has type int and value 7

type I interface { m() }

func f(y I) {
	s// s := y.(string)        // illegal: string does not implement I (missing method m)
	r := y.(io.Reader)     // r has type io.Reader and the dynamic type of y must implement both I and io.Reader
	// ...
}
```

--------------------------------

### Go For Statement with ForClause Example

Source: https://go.dev/doc/go_spec

Illustrates a typical 'for' loop in Go using a ForClause, which includes an initialization (i := 0), a condition (i < 10), and a post-statement (i++). The loop body calls function f with the current value of i.

```go
for i := 0; i < 10; i++ {
	f(i)
}

```

--------------------------------

### Go Function Declaration with Body

Source: https://go.dev/doc/go_spec

Shows a standard Go function declaration that includes a function body. The example highlights the requirement for a terminating statement if the signature declares result parameters.

```go
func IndexRune(s string, r rune) int {
	for i, c := range s {
		if c == r {
			return i
		}
	}
	// invalid: missing return statement
}
```

--------------------------------

### Go io.Writer Interface Example

Source: https://go.dev/doc/faq

Demonstrates the use of the `io.Writer` interface with `fmt.Fprintf`. It highlights that a `var w io.Writer` can be passed directly, but passing its address (`&w`) results in a compile-time error because a pointer to an interface cannot satisfy the interface itself, with the exception of the empty interface.

```go
package main

import (
	"fmt"
	"io"
)

func main() {
	var w io.Writer

	// This works as 'w' satisfies io.Writer
	fmt.Fprintf(w, "hello, world\n")

	// This causes a compile-time error: fmt.Fprintf expects an io.Writer, not *io.Writer
	// fmt.Fprintf(&w, "hello, world\n")
}

```

--------------------------------

### Go Defer Statement Examples

Source: https://go.dev/doc/go_spec

Demonstrates practical uses of the defer statement in Go, including unlocking a mutex before returning and executing deferred functions in reverse order within a loop. It also shows how a deferred function can modify named return values.

```go
lock(l)
defers unlock(l)  // unlocking happens before surrounding function returns

// prints 3 2 1 0 before surrounding function returns
for i := 0; i <= 3; i++ {
	defer fmt.Print(i)
}

// f returns 42
func f() (result int) {
	defer func() {
		// result is accessed after it was set to 6 by the return statement
		result *= 7
	}()
	return 6
}
```

--------------------------------

### New Functionality in Go Packages

Source: https://go.dev/doc/devel/weekly

Highlights new functions and features introduced in various Go packages. Examples include the addition of EqualFold in the bytes package, support for varint encoding in encoding/binary, and the introduction of new experimental database packages under exp/sql.

```Go
// bytes package
func EqualFold(s, t []byte) bool

// encoding/binary package
// Support for varint encoding added.

// exp/sql and exp/sql/driver packages
// New database packages introduced.
```

--------------------------------

### Go unsafe Pointer Type Alias Example

Source: https://go.dev/doc/go_spec

Shows how to create a type alias for unsafe.Pointer and use it for type conversions. This is another way to achieve low-level memory access, similar to direct Pointer usage.

```go
type ptr unsafe.Pointer
bits = *(*uint64)(ptr(&f))
```

--------------------------------

### ResolveReference in net/url: Preserving Multiple Leading Slashes

Source: https://go.dev/doc/go1

Demonstrates how url.ResolveReference now preserves multiple leading slashes in target URLs, ensuring correct redirect following by http.Client. This change aligns with RFC 3986.

```go
base, _ := url.Parse("http://host//path//to/page1")
target, _ := url.Parse("page2")
fmt.Println(base.ResolveReference(target))
```

--------------------------------

### Go Type Parameter Conversion Example

Source: https://go.dev/doc/go_spec

Illustrates how converting a constant to a type parameter results in a non-constant value. The precision of subsequent operations depends on the type argument used to instantiate the type parameter.

```Go
func f[P ~float32|~float64]() {
	… P(1.1) …
}
```

--------------------------------

### Go Doc Enhancements - Go

Source: https://go.dev/doc/go1

The 'go doc' command now displays functions returning slices of type T or *T alongside functions returning single T or *T for a given type T. This provides a more comprehensive view of related functions directly within the type's documentation.

```go
$ go doc mail.Address
package mail // import "net/mail"

type Address struct {
    Name    string
    Address string
}
    Address represents a single mail address.

func ParseAddress(address string) (*Address, error)
func ParseAddressList(list string) ([]*Address, error)
func (a *Address) String() string
$
```

--------------------------------

### Main Function for Testing in Go

Source: https://go.dev/doc/articles/wiki

A `main` function demonstrating the usage of `Page` struct, its `save` method, and the `loadPage` function. It creates a `Page`, saves it, loads it back, and prints its body content. Assumes `loadPage` with error handling is used.

```go
func main() {
    p1 := &Page{Title: "TestPage", Body: []byte("This is a sample Page.")}
    p1.save()
    p2, _ := loadPage("TestPage")
    fmt.Println(string(p2.Body))
}

```

--------------------------------

### Go Generic Method Example

Source: https://go.dev/doc/faq

This snippet demonstrates a generic method `Nop` defined on a struct `Empty`. The subsequent `TryNops` function illustrates the complexity of checking interface implementations for generic methods with different type parameters.

```go
type Empty struct{}

func (Empty) Nop[T any](x T) T {
    return x
}

func TryNops(x any) {
    if x, ok := x.(interface{ Nop(string) string }); ok {
        fmt.Printf("string %s\n", x.Nop("hello"))
    }
    if x, ok := x.(interface{ Nop(int) int }); ok {
        fmt.Printf("int %d\n", x.Nop(42))
    }
    if x, ok := x.(interface{ Nop(io.Reader) io.Reader }); ok {
        data, err := io.ReadAll(x.Nop(strings.NewReader("hello world")))
        fmt.Printf("reader %q %v\n", data, err)
    }
}
```

--------------------------------

### Run Instrumented Go Binary and Collect Coverage Data

Source: https://go.dev/doc/build-cover

Executes a Go binary that was built with coverage instrumentation. Coverage data is written to files in a directory specified by the `GOCOVERDIR` environment variable. If `GOCOVERDIR` is not set, a warning is issued, and no coverage data is emitted.

```bash
mkdir somedata
GOCOVERDIR=somedata ./myprogram.exe

```

```bash
./myprogram.exe

```

--------------------------------

### Go Method Values: Pointer Receiver Example

Source: https://go.dev/doc/go_spec

Shows creating a method value from a struct with a pointer receiver. The expression `pt.Mp` yields a function value that behaves like a call to the method with the pointer receiver.

```go
type T struct {
	a int
}
func (tp *T) Mp(f float32) float32 { return 1 }  // pointer receiver

var pt *T

// The expression pt.Mp yields a function value of type func(float32) float32

```

--------------------------------

### Go Method Values: Value Receiver Example

Source: https://go.dev/doc/go_spec

Illustrates creating a method value from a struct with a value receiver. The expression `t.Mv` results in a function value that can be called later, equivalent to directly calling the method.

```go
type T struct {
	a int
}
func (tv  T) Mv(a int) int         { return 0 }  // value receiver

var t T

// The expression t.Mv yields a function value of type func(int) int
// These two invocations are equivalent:
t.Mv(7)
f := t.Mv; f(7)

```

--------------------------------

### Configure Git Email Address

Source: https://go.dev/doc/contribute

Sets the global or local Git configuration for the user's email address. This ensures that all subsequent Git commits use the specified email, which should match the Google account used for contributions.

```bash
git config --global user.email name@example.com   # change global config
git config user.email name@example.com            # change local config

```

--------------------------------

### Get Current Go Stack Trace

Source: https://go.dev/doc/diagnostics

Returns the current stack trace using the debug.Stack function. This is useful for observing the number of running goroutines, their activities, and identifying potential blocking issues.

```go
import "runtime/debug"

stackTrace := debug.Stack()
```

--------------------------------

### Declare Module Path (v2+)

Source: https://go.dev/doc/modules/gomod-ref

Example of declaring the module path for a Go module version 2 or later. The syntax requires appending the major version number (e.g., /v2) to the module path.

```go
module example.com/mymodule/v2
```

--------------------------------

### Go Type Assertion for Custom JSON SyntaxError

Source: https://go.dev/doc/articles/error_handling

An example of how a caller might use a type assertion to check if an error is a `json.SyntaxError` and then access its `Offset` field to provide more context in the error message.

```go
if err := dec.Decode(&val); err != nil {
    if serr, ok := err.(*json.SyntaxError); ok {
        line, col := findLine(f, serr.Offset)
        return fmt.Errorf("%s:%d:%d: %v", f.Name(), line, col, err)
    }
    return err
}
```

--------------------------------

### Go Reflection: Getting Pointer's Type and Settability

Source: https://go.dev/doc/articles/laws_of_reflection

This snippet illustrates how to inspect a reflection Value that holds a pointer. It shows how to print the type of the pointer and checks its settability, which is typically false for the pointer itself.

```go
var x float64 = 3.4
p := reflect.ValueOf(&x) // Note: take the address of x.
fmt.Println("type of p:", p.Type())
fmt.Println("settability of p:", p.CanSet())
```

--------------------------------

### Go Doc Link Example with Bytes Package

Source: https://go.dev/doc/comment

This Go code snippet demonstrates the usage of doc links within comments. It shows how to reference exported identifiers like `io.EOF` and `ErrTooLarge` using bracketed notation, and how to link to types using [*bytes.Buffer].

```go
package bytes

// ReadFrom reads data from r until EOF and appends it to the buffer, growing
// the buffer as needed. The return value n is the number of bytes read. Any
// error except [io.EOF] encountered during the read is also returned. If the
// buffer becomes too large, ReadFrom will panic with [ErrTooLarge].
func (b *Buffer) ReadFrom(r io.Reader) (n int64, err error) {
    ...
}

```

--------------------------------

### Send Email with Reviewer/CC Information

Source: https://go.dev/doc/contribute

Send an email related to code review, optionally specifying a reviewer and CCing other email addresses. This command is part of the `git-codereview` toolset and uses `-r` for reviewers and `-cc` for additional recipients, accepting comma-separated email lists.

```bash
$ git codereview mail -r joe@golang.org -cc mabel@example.com,math-nuts@swtch.com
```

--------------------------------

### Get Module Version with Go

Source: https://go.dev/doc/modules/publishing

Retrieves a specific version of a Go module. Developers use this command to add a dependency on a particular version of a module to their own projects. It can be used to fetch the latest version or a specific tagged release.

```bash
$ go get example.com/mymodule@v0.1.0

```

--------------------------------

### Go: Difference Between `new` and `make` for Slices

Source: https://go.dev/doc/effective_go

Highlights the distinction between using `new` and `make` for slice allocation in Go. `new` returns a pointer to a nil slice, while `make` returns an initialized slice.

```go
var p *[]int = new([]int)       // allocates slice structure; *p == nil; rarely useful
var v  []int = make([]int, 100) // the slice v now refers to a new array of 100 ints

// Unnecessarily complex:
var p *[]int = new([]int)
*p = make([]int, 100, 100)

// Idiomatic:
v := make([]int, 100)

```

--------------------------------

### C: Type Casting Syntax

Source: https://go.dev/doc/articles/gos_declaration_syntax

Illustrates C's type casting syntax using parentheses around the type, as seen in the example of casting a double to an integer. This is necessary because type and declaration syntax are unified in C.

```c
(int)M_PI

```

--------------------------------

### Run Unit Tests with Go

Source: https://go.dev/doc/modules/publishing

Executes all unit tests within your Go module using the Go testing framework. This command verifies the functionality of your packages and ensures that changes do not introduce regressions. It's recommended to run this before tagging a new version.

```bash
$ go test ./...

```

--------------------------------

### List and Test Go Packages in Current Directory with 'go list' and 'go test'

Source: https://go.dev/doc/articles/go_command

When no paths are specified, 'go list' and 'go test' operate on the current directory. 'go list' shows the import path, and 'go test -v' runs verbose tests, reporting the status of each test function.

```bash
cd github.com/google/codesearch/regexp
$ go list
github.com/google/codesearch/regexp
$ go test -v
=== RUN   TestNstateEnc
--- PASS: TestNstateEnc (0.00s)
=== RUN   TestMatch
--- PASS: TestMatch (0.00s)
=== RUN   TestGrep
--- PASS: TestGrep (0.00s)
PASS
ok  	github.com/google/codesearch/regexp	0.018s
$ 
```

--------------------------------

### Go Build: Applying Flags to Specific Packages

Source: https://go.dev/doc/go1

Demonstrates how to apply build flags like '-gcflags' and '-ldflags' to specific packages or patterns. Previously, flags applied to all dependencies; now, they are more targeted, improving build control and reducing unnecessary recompilation. This is useful for fine-tuning build processes for complex projects.

```go
go build -gcflags=-m mypkg
go install -ldflags=cmd/gofmt=-X=main.version=1.2.3 cmd/...
```

--------------------------------

### Go Module Pseudo-Version Example

Source: https://go.dev/doc/modules/version-numbers

Illustrates a pseudo-version number format used by Go tools for untagged commits. This format includes a base version prefix, a timestamp, and a revision identifier, signaling an unstable module without backward compatibility guarantees.

```go
v0.0.0-20170915032832-14c0d48ead0c
```

--------------------------------

### Go Interface Satisfaction: Opener Example

Source: https://go.dev/doc/faq

Illustrates another scenario where a type `T3` with a specific return type for its `Open` method does not satisfy the `Opener` interface. Highlights Go's strict interface satisfaction rules.

```Go
import "io"
type Reader interface {
   Read([]byte) (int, error)
}

type Opener interface {
   Open() Reader
}

type T3 int
func (t T3) Open() *os.File { return nil } // does not satisfy Opener
```

--------------------------------

### Go: Constructor Function with Boilerplate

Source: https://go.dev/doc/effective_go

Demonstrates a traditional Go constructor function with explicit field assignments. This approach is functional but can be verbose.

```go
func NewFile(fd int, name string) *File {
    if fd < 0 {
        return nil
    }
    f := new(File)
    f.fd = fd
    f.name = name
    f.dirinfo = nil
    f.nepipe = 0
    return f
}

```

--------------------------------

### Importing and Using Remote Go Modules

Source: https://go.dev/doc/code

Demonstrates importing an external Go module ('github.com/google/go-cmp/cmp') into the main program. It also shows how 'go mod tidy' automatically downloads and manages module dependencies, updating the 'go.mod' file.

```go
package main

import (
    "fmt"

    "example/user/hello/morestrings"
    "github.com/google/go-cmp/cmp"
)

func main() {
    fmt.Println(morestrings.ReverseRunes("!oG ,olleH"))
    fmt.Println(cmp.Diff("Hello World", "Hello Go"))
}
```

```bash
go mod tidy
go install example/user/hello
```

--------------------------------

### Go Struct Embedding Example: bufio.ReadWriter

Source: https://go.dev/doc/effective_go

Illustrates embedding pointers to bufio.Reader and bufio.Writer within a struct to create a combined ReadWriter. This allows the outer struct to inherit methods from the embedded types without explicit forwarding. It requires the 'bufio' and 'io' packages.

```go
// ReadWriter stores pointers to a Reader and a Writer.
// It implements io.ReadWriter.
type ReadWriter struct {
    *Reader  // *bufio.Reader
    *Writer  // *bufio.Writer
}
```

--------------------------------

### Go Interface Definitions with Type Terms

Source: https://go.dev/doc/go_spec

Examples demonstrating how to define Go interfaces using type terms for specific types, underlying types, and methods. These snippets illustrate the syntax for creating interfaces that represent a single type, types with a specific underlying type, or types that implement certain methods.

```go
// An interface representing only the type int.
interface {
	int
}

// An interface representing all types with underlying type int.
interface {
	~int
}

// An interface representing all types with underlying type int that implement the String method.
interface {
	~int
	String() string
}

// An interface representing an empty type set: there is no type that is both an int and a string.
interface {
	int
	string
}
```

--------------------------------

### Go Expression Evaluation Order Example

Source: https://go.dev/doc/go_spec

Illustrates Go's lexical left-to-right evaluation for function calls and communication within expressions. It highlights how evaluation order impacts results for variables, maps, and function calls.

```Go
y[f()], ok = g(z || h(), i()+x[j()], <-c), k()
// Function calls and communication happen in the order f(), h() (if z is false), i(), j(), <-c, g(), and k().
// The order relative to evaluating x and its indexing, and evaluating y and z, is not specified except lexically.

a := 1
f := func() int { a++; return a }
x := []int{a, f()}            // x may be [1, 2] or [2, 2]
m := map[int]int{a: 1, a: 2}  // m may be {2: 1} or {2: 2}
n := map[int]int{a: f()}      // n may be {2: 3} or {3: 3}
```

--------------------------------

### Go Type Documentation: Zero Value Meaning

Source: https://go.dev/doc/comment

Explains how to document the meaning of a Go type's zero value. If the zero value has a useful and non-obvious meaning, it should be documented. This example shows that the zero value for a bytes.Buffer is an empty buffer ready to use.

```go
package bytes

// A Buffer is a variable-sized buffer of bytes with Read and Write methods.
// The zero value for Buffer is an empty buffer ready to use.
type Buffer struct {
    ...
}
```

--------------------------------

### Go Package Initialization with Dependencies and Functions

Source: https://go.dev/doc/go_spec

Illustrates package variable initialization with interdependencies and a helper function. The initialization order is determined by readiness and declaration sequence, handling potential cycles.

```Go
var (
	a = c + b  // == 9
	b = f()    // == 4
	c = f()    // == 5
	d = 3      // == 5 after initialization has finished
)

func f() int {
	d++
	return d
}
```

--------------------------------

### Implement Edit and Save Handlers for Wiki Pages in Go

Source: https://go.dev/doc/articles/wiki

Adds functionality to edit and save wiki pages using Go's net/http package. It defines `editHandler` to display an HTML form for editing and `saveHandler` to process form submissions. This example demonstrates handling different HTTP methods (POST) and managing form data.

```go
func main() {
    http.HandleFunc("/view/", viewHandler)
    http.HandleFunc("/edit/", editHandler)
    http.HandleFunc("/save/", saveHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func editHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/edit/"):]
    p, err := loadPage(title)
    if err != nil {
        p = &Page{Title: title}
    }
    fmt.Fprintf(w, "<h1>Editing %s</h1>"+
        "<form action=\"Save/%s\" method=\"POST\">"+        "<textarea name=\"body\">%s</textarea><br>"+        "<input type=\"submit\" value=\"Save\">"+        "</form>",
        p.Title, p.Title, p.Body)
}

```

--------------------------------

### Go For Loop Variable Scoping (Go 1.22+)

Source: https://go.dev/doc/go_spec

Demonstrates the Go 1.22 behavior where each iteration of a 'for' loop has its own separate declared variable. The example appends functions to a slice, each printing the value of 'i' from its specific iteration.

```go
var prints []func()
for i := 0; i < 5; i++ {
	prints = append(prints, func() { println(i) })
	i++
}
for _, p := range prints {
	p()
}

```

--------------------------------

### Go Valid Struct Type Declarations

Source: https://go.dev/doc/go_spec

Presents examples of valid struct type declarations in Go, demonstrating how to correctly include self-referential types using pointers, function types, or slices within arrays.

```Go
// valid struct types
type (
	T5 struct{ f *T5 }         // T5 contains T5 as component of a pointer
	T6 struct{ f func() T6 }   // T6 contains T6 as component of a function type
	T7 struct{ f [10][]T7 }    // T7 contains T7 as component of a slice in an array
)

```

--------------------------------

### Go json.SyntaxError Type Example

Source: https://go.dev/doc/articles/error_handling

Shows a custom error type `SyntaxError` used by the `json` package. It includes specific fields like `msg` and `Offset` to provide detailed information about a JSON parsing error.

```go
type SyntaxError struct {
    msg    string // description of error
    Offset int64  // error occurred after reading Offset bytes
}

func (e *SyntaxError) Error() string { return e.msg }
```

--------------------------------

### Go Typed Constants with Group Doc Comment

Source: https://go.dev/doc/comment

Example of documenting typed constants in Go. When constants are tied to a specific type, their documentation often relies on the type's doc comment, with concise end-of-line comments for individual constants.

```Go
package syntax

// An Op is a single regular expression operator.
type Op uint8

const (
    OpNoMatch        Op = 1 + iota // matches no strings
    OpEmptyMatch                   // matches empty string
    OpLiteral                      // matches Runes sequence
    OpCharClass                    // matches Runes interpreted as range pair list
    OpAnyCharNotNL                 // matches any character except newline
    ...
)

```

--------------------------------

### Go: Attempt to use fmt.Fprintf with a pointer to io.Writer (Error Example)

Source: https://go.dev/doc/go_faq

Illustrates a common mistake where a pointer to an io.Writer is passed to fmt.Fprintf, resulting in a compile-time error. This highlights the rule that pointers to interfaces generally cannot satisfy interfaces.

```go
fmt.Fprintf(&w, "hello, world\n") // Compile-time error.
```

--------------------------------

### Build Go Binary for Coverage Profiling

Source: https://go.dev/doc/build-cover

Builds a Go application binary with coverage instrumentation enabled. This allows the binary to collect coverage data when executed. The `-cover` flag is used for this purpose. Packages within the main module are selected by default, but `-coverpkg` can be used for explicit control.

```bash
go build -cover -o myprogram.exe .

```

```bash
go build -cover -o myprogramMorePkgs.exe -coverpkg=io,mydomain.com,rsc.io/quote .

```

--------------------------------

### Main Event Loop for Handling Completed Resources

Source: https://go.dev/doc/codewalk/sharemem

Receives completed 'Resource' pointers from the 'complete' channel. For each received resource, it starts a new goroutine to call the 'Sleep' method, allowing sleeps to occur in parallel.

```go
for r := range complete {
	go r.Sleep(time.Second)
}
```

--------------------------------

### Example Data Race in Go

Source: https://go.dev/doc/articles/race_detector

Illustrates a common data race scenario in Go where two goroutines concurrently access and modify a map without proper synchronization, potentially leading to crashes or memory corruption.

```go
func main() {
	c := make(chan bool)
	m := make(map[string]string)
	go func() {
		m["1"] = "a" // First conflicting access.
		c <- true
	}()
	m["2"] = "b" // Second conflicting access.
	<-c
	for k, v := range m {
		fmt.Println(k, v)
	}
}
```

--------------------------------

### Go Chained Function Call Example

Source: https://go.dev/doc/go_spec

Demonstrates a special case in Go where the return values of one function (`Split`) are directly passed as arguments to another function (`Join`). This is valid when the number and types of return values match the parameters.

```go
func Split(s string, pos int) (string, string) {
	return s[0:pos], s[pos:]
}

func Join(s, t string) string {
	return s + t
}

if Join(Split(value, len(value)/2)) != value {
	log.Panic("test fails")
}
```

--------------------------------

### Run the 'hello' application

Source: https://go.dev/doc/tutorial/call-module-code

Executes the Go application located in the current directory ('hello'). This command compiles and runs the 'main' package, demonstrating the successful call to the 'Hello' function from the 'greetings' module.

```shell
$ go run .
Hi, Gladys. Welcome!
```

--------------------------------

### Go Constants and Struct Field Access in Assembly

Source: https://go.dev/doc/asm

Demonstrates how to access Go constants and struct field offsets/sizes within assembly code by including the `go_asm.h` header. This ensures robustness against changes in Go type definitions and compiler layout rules.

```Assembly
#include "go_asm.h"

// Example: Accessing a Go constant `bufSize`
const bufSize = 1024

// Example: Accessing a Go struct `reader`
type reader struct {
	buf [bufSize]byte
	r   int
}

// In assembly, refer to:
// - Constant value: const_bufSize
// - Struct size: reader__size
// - Field offsets: reader_buf, reader_r

// Example usage: If R1 points to a `reader` struct
// Accessing the `r` field:
reader_r(R1)
```

--------------------------------

### Retry Git Codereview Mail

Source: https://go.dev/doc/contribute

This snippet illustrates the command to retry sending mail for code review after correcting Git configuration or commit author details. It's a final step in troubleshooting mail errors.

```shell
$ git codereview mail
```

--------------------------------

### Go Variadic Parameter Example

Source: https://go.dev/doc/go_spec

Demonstrates how variadic parameters in Go function signatures behave. When no arguments are provided, the parameter is nil. When multiple arguments are provided, they are treated as a slice. When a slice is explicitly passed with '...', it's passed as is without creating a new slice.

```Go
package main

import "fmt"

func Greeting(prefix string, who ...string) {
	fmt.Printf("%s ", prefix)
	if who == nil {
		fmt.Println("nobody")
	} else {
		fmt.Println(who)
	}
}

func main() {
	Greeting("nobody")
	Greeting("hello:", "Joe", "Anna", "Eileen")

	s := []string{"James", "Jasmine"}
	Greeting("goodbye:", s...)
}

```

--------------------------------

### Go Shift Operation Examples with Constants and Variables

Source: https://go.dev/doc/go_spec

Illustrates the behavior of shift operations in Go, particularly when operands are untyped constants or variables of different types. It highlights type conversion rules and potential issues like overflow and type mismatches.

```go
var a [1024]byte
var s uint = 33

// The results of the following examples are given for 64-bit ints.
var i = 1<<s                   // 1 has type int
var j int32 = 1<<s             // 1 has type int32; j == 0
var k = uint64(1<<s)           // 1 has type uint64; k == 1<<33
var m int = 1.0<<s             // 1.0 has type int; m == 1<<33
var n = 1.0<<s == j            // 1.0 has type int32; n == true
var o = 1<<s == 2<<s           // 1 and 2 have type int; o == false
var p = 1<<s == 1<<33          // 1 has type int; p == true
var u = 1.0<<s                 // illegal: 1.0 has type float64, cannot shift
var u1 = 1.0<<s != 0           // illegal: 1.0 has type float64, cannot shift
var u2 = 1<<s != 1.0           // illegal: 1 has type float64, cannot shift
var v1 float32 = 1<<s          // illegal: 1 has type float32, cannot shift
var v2 = string(1<<s)          // illegal: 1 is converted to a string, cannot shift
var w int64 = 1.0<<33          // 1.0<<33 is a constant shift expression; w == 1<<33
var x = a[1.0<<s]              // panics: 1.0 has type int, but 1<<33 overflows array bounds
var b = make([]byte, 1.0<<s)   // 1.0 has type int; len(b) == 1<<33

// The results of the following examples are given for 32-bit ints,
// which means the shifts will overflow.
var mm int = 1.0<<s            // 1.0 has type int; mm == 0
var oo = 1<<s == 2<<s          // 1 and 2 have type int; oo == true
var pp = 1<<s == 1<<33         // illegal: 1 has type int, but 1<<33 overflows int
var xx = a[1.0<<s]             // 1.0 has type int; xx == a[0]
var bb = make([]byte, 1.0<<s)  // 1.0 has type int; len(bb) == 0

```

--------------------------------

### Gate Goroutine Creation with Channels

Source: https://go.dev/doc/effective_go

An improved version of `Serve` that gates the creation of goroutines using a buffered channel to prevent resource exhaustion. Goroutines are created only when space is available in the semaphore.

```go
func Serve(queue chan *Request) {
    for req := range queue {
        sem <- 1
        go func() {
            process(req)
            <-sem
        }()
    }
}
```

--------------------------------

### Get Length and Capacity of Go Slices/Strings in GDB

Source: https://go.dev/doc/gdb

Illustrates the usage of GDB extension functions `$len` and `$cap` to retrieve the length and capacity of Go strings, arrays, and slices. These functions are part of the Go GDB runtime extension.

```gdb
(gdb) p $len(utf)
$23 = 4
```

```gdb
(gdb) p $cap(utf)
$24 = 4
```

--------------------------------

### Rebasing to Latest Master Commit with Git

Source: https://go.dev/doc/contribute

Provides the Git command to rebase the current branch onto the latest commit of the master branch. This is a common practice to incorporate recent changes and resolve potential conflicts before uploading a new patch.

```bash
git rebase
```

--------------------------------

### Go Ambiguous Conversions with Pointers and Functions

Source: https://go.dev/doc/go_spec

Demonstrates how to use parentheses to resolve ambiguity when converting types that start with operators like `*` or `<-`, or function types. This ensures the compiler correctly interprets the intended conversion target.

```Go
*Point(p)        // same as *(Point(p))
(*Point)(p)      // p is converted to *Point
<-chan int(c)    // same as <-(chan int(c))
(<-chan int)(c)  // c is converted to <-chan int
func()(x)        // function signature func() x
(func())(x)      // x is converted to func()
(func() int)(x)  // x is converted to func() int
func() int(x)    // x is converted to func() int (unambiguous)
```

--------------------------------

### Get Number of Current Go Goroutines

Source: https://go.dev/doc/diagnostics

Returns the count of currently active goroutines using the runtime.NumGoroutine function. Monitoring this value helps assess goroutine utilization and detect potential goroutine leaks.

```go
import "runtime"

numGoroutines := runtime.NumGoroutine()
```

--------------------------------

### Initialize and Declare Go Map

Source: https://go.dev/doc/effective_go

Demonstrates how to declare and initialize a map with string keys and integer values using composite literal syntax. This map represents time zones and their corresponding UTC offsets.

```go
var timeZone = map[string]int{
    "UTC":  0*60*60,
    "EST": -5*60*60,
    "CST": -6*60*60,
    "MST": -7*60*60,
    "PST": -8*60*60,
}

```

--------------------------------

### Configure Git User Email

Source: https://go.dev/doc/contribute

This snippet demonstrates how to configure Git to use a specific email address for a repository, which is often necessary to resolve 'author email address does not match your user account' errors when using 'git codereview mail'.

```shell
$ git config user.email email@address.com
```

--------------------------------

### Go Invalid Struct Type Declarations

Source: https://go.dev/doc/go_spec

Provides examples of invalid struct type declarations in Go where a struct contains a field of its own type or a type that recursively contains it, directly or indirectly through arrays or structs.

```Go
// invalid struct types
type (
	T1 struct{ T1 }            // T1 contains a field of T1
	T2 struct{ f [10]T2 }      // T2 contains T2 as component of an array
	T3 struct{ T4 }            // T3 contains T3 as component of an array in struct T4
	T4 struct{ f [10]T3 }      // T4 contains T4 as component of struct T3 in an array
)

```

--------------------------------

### Go Invalid Array Type Definitions

Source: https://go.dev/doc/go_spec

Shows examples of invalid array type definitions in Go where an array type directly or indirectly contains itself as an element type within array or struct types.

```Go
// invalid array types
type (
	T1 [10]T1                 // element type of T1 is T1
	T2 [10]struct{ f T2 }     // T2 contains T2 as component of a struct
	T3 [10]T4                 // T3 contains T3 as component of a struct in T4
	T4 struct{ f T3 }         // T4 contains T4 as component of array T3 in a struct
)

```

--------------------------------

### Reflect Package Struct Tag Scheme (Go)

Source: https://go.dev/doc/devel/weekly

Demonstrates the new struct tag scheme in the reflect package for sharing struct tags between multiple packages. It shows how to use the `Get` method on `reflect.StructTag` to retrieve tag values.

```Go
type T struct {
        X int `json:"name"`  // or `xml:"name"`
}

// Example usage (conceptual):
// tag := reflect.StructField{Tag: `json:"name" xml:"name2"`}
// jsonName := tag.Get("json") // returns "name"
// xmlName := tag.Get("xml") // returns "name2"
```

--------------------------------

### Go Semicolon Insertion Rules Example

Source: https://go.dev/doc/effective_go

Demonstrates the Go lexer's automatic semicolon insertion rule. Semicolons are inserted after tokens like identifiers, literals, and specific keywords (break, continue, return, ++, --, ), }) if they are followed by a newline. This rule allows for mostly semicolon-free code but has implications for brace placement.

```Go
if i < f() {
    g()
}
```

--------------------------------

### Go 'for range' with Integer Iteration (Go 1.22+)

Source: https://go.dev/doc/go_spec

Demonstrates the 'for range' clause in Go when iterating over a sequence of integers, starting from zero up to a specified limit (exclusive). This feature was introduced in Go 1.22.

```Go
for i := range 10 {
    // i will take values 0, 1, 2, ..., 9
    println(i)
}

// With a variable
limit := 5
for num := range limit {
    // num will take values 0, 1, 2, 3, 4
    println(num)
}
```

--------------------------------

### Go Function to Get Album by ID

Source: https://go.dev/doc/tutorial/web-service-gin

A Go function that retrieves a specific album by its ID from a slice of albums. It uses the gin.Context to extract the ID from the URL path and returns the album as JSON or a 404 error if not found.

```go
// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
    id := c.Param("id")

    // Loop over the list of albums, looking for
    // an album whose ID value matches the parameter.
    for _, a := range albums {
        if a.ID == id {
            c.IndentedJSON(http.StatusOK, a)
            return
        }
    }
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}
```

--------------------------------

### Go Dot Import Example

Source: https://go.dev/doc/go1compat

Demonstrates the use of dot imports in Go. Importing a package with a dot (`import . "path"`) can lead to naming conflicts if the imported package adds new exported names in future releases. This is generally discouraged outside of testing scenarios.

```go
package main

import (
	. "fmt"
	"os"
)

func main() {
	// Using Println directly due to dot import from "fmt"
	Println("This might conflict if 'fmt' adds a new exported name like 'Println' itself.")

	// Example of a potential conflict with a standard library package
	// For instance, if 'os' later defined a top-level variable named 'Println'
	// os.Println("Potential conflict") // This would fail compilation if a conflict arises
}
```

--------------------------------

### Main function to run Pig tournament and display results in Go

Source: https://go.dev/doc/codewalk/functions

The main function initializes strategies, runs a round-robin tournament, and prints the win/loss record. It demonstrates how to orchestrate the game simulation and analyze strategy performance.

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	strategies := make([]strategy, numStrategies)
	for k := 0; k < numStrategies; k++ {
		strategies[k] = stayAtK(k)
	}

	rankings := roundRobin(strategies, gamesPerSeries)

	for i, row := range rankings {
		wins := 0
		for _, w := range row {
			wins += w
		}
		fmt.Printf("%15s: %5d wins / %5d games | %s\n",
			ratioString("player", strconv.Itoa(i)), wins, gamesPerSeries*numStrategies,
			ratioString("score", fmt.Sprintf("%.2f%%", float64(wins)*100.0/float64(gamesPerSeries*numStrategies))),
		)
	}
}

```

--------------------------------

### Go Illegal Generic Alias Method Declarations

Source: https://go.dev/doc/go_spec

Shows examples of illegal method declarations involving generic type aliases in Go. These highlight restrictions where aliases cannot be generic or denote instantiated generic types.

```go
type GPoint[P any] = Point
type HPoint        = *GPoint[int]
type IPair         = Pair[int, int]

func (*GPoint[P]) Draw(P)   { ... }  // illegal: alias must not be generic
func (HPoint) Draw(P)       { ... }  // illegal: alias must not denote instantiated type GPoint[int]
func (*IPair) Second() int  { ... }  // illegal: alias must not denote instantiated type Pair[int, int]
```

--------------------------------

### Go Custom Error Type and Panic for Parsing Errors

Source: https://go.dev/doc/effective_go

This example shows a Go pattern where a package uses `panic` with a custom error type to signal parsing errors. The `Compile` function uses `defer` and `recover` to catch these specific errors, convert them to standard Go errors, and return them to the caller, while allowing other panics to propagate.

```Go
// Error is the type of a parse error; it satisfies the error interface.
type Error string
func (e Error) Error() string {
    return string(e)
}

// error is a method of *Regexp that reports parsing errors by
// panicking with an Error.
func (regexp *Regexp) error(err string) {
    panic(Error(err))
}

// Compile returns a parsed representation of the regular expression.
func Compile(str string) (regexp *Regexp, err error) {
    regexp = new(Regexp)
    // doParse will panic if there is a parse error.
    defer func() {
        if e := recover(); e != nil {
            regexp = nil    // Clear return value.
            err = e.(Error) // Will re-panic if not a parse error.
        }
    }()
    return regexp.doParse(str), nil
}
```

--------------------------------

### Scan Go Project for Vulnerabilities with Govulncheck

Source: https://go.dev/doc/tutorial/govulncheck

This command initiates a vulnerability scan of the entire Go project, including all its modules. It uses `govulncheck` to analyze the codebase against a known vulnerability database. A successful scan with no vulnerabilities found indicates that the dependency upgrades have resolved all security issues.

```bash
$ govulncheck ./…

```

```bash
govulncheck is an experimental tool. Share feedback at https://go.dev/s/govulncheck-feedback.

Using go1.20.3 and govulncheck@v0.0.0 with
vulnerability data from https://vuln.go.dev (last modified 2023-04-06 19:19:26 +0000 UTC).

Scanning your code and 46 packages across 1 dependent module for known vulnerabilities...
No vulnerabilities found.

```

--------------------------------

### Accept program fragments on standard input in gofmt Go

Source: https://go.dev/doc/devel/weekly

The gofmt command-line tool can now accept program fragments directly from standard input. This makes it more flexible for use in pipelines and scripts where entire files may not be readily available.

```Go
package main

import (
	"bytes"
	"fmt"
	"go/format"
	"os"
)

func main() {
	// Example of formatting a Go code fragment using go/format package.
	// The gofmt tool uses this package. The update allows gofmt to read from stdin.

	fragment := []byte("func main() { \n fmt.Println(  \"hello  \" )\n}")
	formatted, err := format.Source(fragment)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error formatting source: %v\n", err)
		return
	}

	fmt.Println("Original fragment:\n", string(fragment))
	fmt.Println("Formatted output:\n", string(formatted))
	fmt.Println("gofmt now accepts program fragments from standard input.")
}
```

--------------------------------

### Go Redeclaration and Reassignment Example

Source: https://go.dev/doc/effective_go

Demonstrates the Go language feature where a variable can be redeclared and reassigned within the same scope if it's part of a multi-variable declaration (using :=) and at least one other variable is newly declared. This is often used for reusing error variables.

```Go
f, err := os.Open(name)
```

```Go
d, err := f.Stat()
```

--------------------------------

### Call 'Hello' function from 'greetings' module

Source: https://go.dev/doc/tutorial/call-module-code

This Go code defines the main package and imports the 'fmt' package and the local 'example.com/greetings' module. It calls the 'Hello' function from the 'greetings' module with a name and prints the returned message.

```go
package main

import (
    "fmt"

    "example.com/greetings"
)

func main() {
    // Get a greeting message and print it.
    message := greetings.Hello("Gladys")
    fmt.Println(message)
}
```

--------------------------------

### Go Constant Conversions to Typed Constants

Source: https://go.dev/doc/go_spec

Shows examples of converting constant values to different types, resulting in typed constants. This includes conversions to integers, floats, complex numbers, and strings. Note that some conversions are illegal if the value cannot be represented.

```Go
uint(iota)               // iota value of type uint
float32(2.718281828)     // 2.718281828 of type float32
complex128(1)            // 1.0 + 0.0i of type complex128
float32(0.49999999)      // 0.5 of type float32
float64(-1e-1000)        // 0.0 of type float64
string('x')              // "x" of type string
string(0x266c)           // "♬" of type string
myString("foo" + "bar")  // "foobar" of type myString
string([]byte{'a'})      // not a constant: []byte{'a'} is not a constant
(*int)(nil)              // not a constant: nil is not a constant, *int is not a boolean, numeric, or string type
int(1.2)                 // illegal: 1.2 cannot be represented as an int
string(65.0)             // illegal: 65.0 is not an integer constant
```

--------------------------------

### Go Markov Chain Main Function and Flags

Source: https://go.dev/doc/codewalk/markov

The `main` function initializes the Markov chain, sets up command-line flags for the number of words and prefix length, builds the chain from standard input, and generates the output text. It uses the `flag` package for command-line argument parsing and `time` for seeding the random number generator.

```go
func main() {
	// Register command-line flags.
	numWords := flag.Int("words", 100, "maximum number of words to print")
	prefixLen := flag.Int("prefix", 2, "prefix length in words")

	flag.Parse()                     // Parse command-line flags.
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator.

	c := NewChain(*prefixLen)     // Initialize a new Chain.
	c.Build(os.Stdin)             // Build chains from standard input.
	text := c.Generate(*numWords) // Generate text.
}
```

--------------------------------

### Go Assembly DATA and GLOBL Directives for Data Initialization

Source: https://go.dev/doc/asm

Initializes memory sections with DATA directives and declares symbols as global using the GLOBL directive. DATA directives must have increasing offsets. GLOBL declares a symbol and its size, implicitly zeroed unless initialized by DATA.

```goasm
DATA divtab<>+0x00(SB)/4, $0xf4f8fcff
DATA divtab<>+0x04(SB)/4, $0xe6eaedf0
...
DATA divtab<>+0x3c(SB)/4, $0x81828384
GLOBL divtab<>(SB), RODATA, $64

GLOBL runtime·tlsoffset(SB), NOPTR, $4

```

--------------------------------

### Execute Command with Simplified API (Go)

Source: https://go.dev/doc/devel/weekly

This snippet demonstrates the refactored exec package API in Go. It shows how to execute a command and capture its output using a more concise method compared to the previous API. The new API simplifies the process of running external commands and retrieving their results.

```go
return exec.Command("diff", "-u", "file1.txt", "file2.txt").Output()
```

--------------------------------

### Go Doc Comment List Reformatting Example

Source: https://go.dev/doc/comment

Illustrates how `gofmt` reformats indented lists in Go documentation comments. Nested lists are not supported, and `gofmt` typically flattens them. Rewriting for clarity or using mixed list markers are suggested workarounds.

```Go
// Here is a list:
//
//  - Item 1.
//    * Subitem 1.
//    * Subitem 2.
//  - Item 2.
//  - Item 3.

```

```Go
// Here is a list:
//
//  - Item 1.
//  - Subitem 1.
//  - Subitem 2.
//  - Item 2.
//  - Item 3.

```

--------------------------------

### Go Doc Comment List Formatting Workaround Example

Source: https://go.dev/doc/comment

Demonstrates a workaround for unsupported nested lists in Go doc comments by mixing list markers (e.g., numbers and bullets). This method can preserve a semblance of structure when direct nesting is not possible.

```Go
// Here is a list:
//
//  1. Item 1.
//
//     - Subitem 1.
//
//     - Subitem 2.
//
//  2. Item 2.
//
//  3. Item 3.

```

--------------------------------

### Declaring External C Function in Go

Source: https://go.dev/doc/install/gccgo

Demonstrates how to declare a C function (`open`) in Go using the `//extern` directive. This allows Go code to call C functions directly. The parameters must match the C function's signature.

```go
//extern open
func c_open(name *byte, mode int, perm int) int

```

--------------------------------

### Go Finalizer: Self-Reachability Issue

Source: https://go.dev/doc/gc-guide

Shows a Go `runtime.SetFinalizer` example where an object is reachable from itself, creating a reference cycle. This prevents the object from being reclaimed and the finalizer from executing. Ensure objects with finalizers are not in reference cycles.

```Go
f := new(myCycle)
f.self = f // Mistake: f is reachable from f, so this finalizer would never run.
runtime.SetFinalizer(f, func(f *myCycle) {
	...
})

```

--------------------------------

### Implement Set Using Go Map with Boolean Values

Source: https://go.dev/doc/effective_go

Illustrates using a map with boolean values to implement a set. Adding an element involves setting its corresponding value to true, and checking for presence is done by indexing.

```go
attended := map[string]bool{
    "Ann": true,
    "Joe": true,
    ...
}

if attended[person] { // will be false if person is not in the map
    fmt.Println(person, "was at the meeting")
}

```

--------------------------------

### Go Init Function with Panic for Missing Environment Variable

Source: https://go.dev/doc/effective_go

This Go code snippet shows an 'init' function that panics if the 'USER' environment variable is not set. This is presented as a potential counterexample where panicking during initialization might be reasonable if a critical dependency is missing and the program cannot proceed. It utilizes the 'os.Getenv' function to retrieve environment variables.

```Go
var user = os.Getenv("USER")

func init() {
    if user == "" {
        panic("no value for $USER")
    }
}

```

--------------------------------

### Defining Two-Dimensional Slices in Go

Source: https://go.dev/doc/effective_go

Illustrates how to define types that represent two-dimensional data structures in Go using arrays of arrays or slices of slices. Examples include a 3x3 float64 transformation matrix and a slice of byte slices for text lines.

```go
type Transform [3][3]float64  // A 3x3 array, really an array of arrays.
type LinesOfText [][]byte     // A slice of byte slices.
```

```go
text := LinesOfText{
    []byte("Now is the time"),
    []byte("for all good gophers"),
    []byte("to bring some fun to the party."),
}
```

--------------------------------

### amd64 Assembly: Accessing TLS and Runtime Pointers

Source: https://go.dev/doc/asm

This Go assembly snippet shows how to access the thread-local storage (TLS) pointer to the 'g' structure on a 64-bit Intel amd64 architecture. Similar to the 386 version, it uses the 'get_tls' macro but employs 64-bit instructions ('MOVQ') for loading the 'g' pointer and accessing 'g.m'.

```asm
get_tls(CX)
MOVQ	g(CX), AX     // Move g into AX.
MOVQ	g_m(AX), BX   // Move g.m into BX.


```

--------------------------------

### Go Modules: Retract and Signal New Version

Source: https://go.dev/doc/modules/gomod-ref

This example shows how to retract a previously published version and also retract the new version if its sole purpose is to signal the retraction. This is a common pattern when fixing an accidental tag.

```go
retract v1.0.0 // Published accidentally.
retract v1.0.1 // Contains retraction only.

```

--------------------------------

### Go Zero-Size Type Sizeof Example

Source: https://go.dev/doc/go_faq

Demonstrates how Go's padding affects the size of a struct containing a zero-size type. The `unsafe.Sizeof` function is used to show the actual memory footprint, which will be larger than expected due to padding rules designed to prevent pointer overlaps.

```go
func main() {
    type S struct {
        f1 byte
        f2 struct{}
    }
    fmt.Println(unsafe.Sizeof(S{}))
}
```

--------------------------------

### Go syscall.StartProcess Argument Update

Source: https://go.dev/doc/devel/weekly

Demonstrates the updated signature for `syscall.StartProcess`. Similar to `os.StartProcess`, the final three arguments are now passed as a pointer to a `syscall.ProcAttr` struct.

```Go
syscall.StartProcess(bin, args, &syscall.ProcAttr{Files: fds, Dir: dir, Env: env})
```

--------------------------------

### Manage Go Telemetry Mode (Go 1.23+)

Source: https://go.dev/doc/telemetry

Commands to control the Go telemetry mode. Users can opt-in to upload data, disable telemetry entirely, or revert to local-only collection. This functionality is available starting with Go version 1.23.

```bash
go telemetry on
go telemetry off
go telemetry local
```

--------------------------------

### Struct Tag Syntax Update in Go reflect Package

Source: https://go.dev/doc/devel/pre_go1

Demonstrates the updated struct tag scheme in the Go reflect package for sharing tags between packages. Old syntax `"name"` should be replaced with `json:"name"` or `xml:"name"` to conform to the new scheme, which uses `StructTag` and its `Get` method.

```go
type T struct {
	X int "name"
}

// Should be updated to:
type T struct {
	X int `json:"name"`  // or `xml:"name"`
}
```

--------------------------------

### Amend Git Commit Author

Source: https://go.dev/doc/contribute

This snippet shows how to amend the author information of the last Git commit. This is useful when troubleshooting mail errors where the commit's author email does not match the registered user email.

```shell
$ git commit --amend --author="Author Name <email@address.com>"
```

--------------------------------

### Go: Demonstrating Closure Variable Capture Issue

Source: https://go.dev/doc/faq

Illustrates a common pitfall in Go when using closures with loops and goroutines, where loop variables are not captured correctly, potentially leading to unexpected output. This example shows how multiple goroutines might print the same, last value of the loop variable. It requires the 'fmt' and 'sync' packages.

```Go
package main

import (
	"fmt"
	"time"
)

func main() {
	done := make(chan bool)

	values := []string{"a", "b", "c"}
	for _, v := range values {
		go func() {
			fmt.Println(v)
			done <- true
		}()
	}

	// wait for all goroutines to complete before exiting
	for _ = range values {
		<-done
	}

	time.Sleep(1 * time.Second) // Give goroutines a moment to print
}
```

--------------------------------

### Enabling Go Data Race Detector with Build Flags

Source: https://go.dev/doc/articles/race_detector

Demonstrates how to enable the Go data race detector during various build and test operations using the `-race` flag.

```bash
$ go test -race mypkg    // to test the package
$ go run -race mysrc.go  // to run the source file
$ go build -race mycmd   // to build the command
$ go install -race mypkg // to install the package
```

--------------------------------

### C: Nested Function Pointer Declaration

Source: https://go.dev/doc/articles/gos_declaration_syntax

Illustrates a more complex C declaration for a function pointer 'fp' where one of its arguments is also a function pointer. This example emphasizes the readability challenges in C for deeply nested types.

```c
int (*fp)(int (*ff)(int x, int y), int b)

```

--------------------------------

### Go Generic Dot Product Function

Source: https://go.dev/doc/go_spec

Example of a generic function in Go that calculates the dot product of two slices of floating-point numbers. It demonstrates the use of type parameters for `float32` and `float64` and how arithmetic operations are performed with the precision of the instantiated type.

```go
func dotProduct[F ~float32|~float64](v1, v2 []F) F {
	var s F
	for i, x := range v1 {
		y := v2[i]
		s += x * y
	}
	return s
}

```

--------------------------------

### Indented Wrapped Text Rendered as Code Block (Go)

Source: https://go.dev/doc/comment

Shows an example in Go doc comments where a wrapped line of text is indented, causing it to be interpreted as a code block. This illustrates a common mistake requiring manual correction.

```go
// TODO Revisit this design. It may make sense to walk those nodes
//      only once.

// According to the document:
// "The alignment factor (in bytes) that is used to align the raw data of sections in
//  the image file. The value should be a power of 2 between 512 and 64 K, inclusive."

```

--------------------------------

### Launch and Wait for Parallel Goroutines in Go

Source: https://go.dev/doc/effective_go

Demonstrates how to parallelize a task across multiple CPU cores in Go using goroutines. It launches 'DoSome' tasks concurrently and waits for all of them to complete by draining a completion channel.

```Go
const numCPU = 4 // number of CPU cores

func (v Vector) DoAll(u Vector) {
    c := make(chan int, numCPU)  // Buffering optional but sensible.
    for i := 0; i < numCPU; i++ {
        go v.DoSome(i*len(v)/numCPU, (i+1)*len(v)/numCPU, u, c)
    }
    // Drain the channel.
    for i := 0; i < numCPU; i++ {
        <-c    // wait for one task to complete
    }
    // All done.
}

```

--------------------------------

### Go Generic Type with Method

Source: https://go.dev/doc/go_spec

Demonstrates how to define a method for a generic type in Go. The method receiver must declare the same number of type parameters as the generic type definition. This example shows a `Len()` method for the generic `List[T]` type.

```go
// The method Len returns the number of elements in the linked list l.
func (l *List[T]) Len() int  { … }
```

--------------------------------

### Go Unit Tests for Greetings

Source: https://go.dev/doc/tutorial/add-a-test

This Go code defines unit tests for the `greetings.Hello` function. It includes tests for a valid name input and an empty string input, checking for correct output and error handling respectively. These tests leverage Go's `testing` package and regular expressions for validation.

```go
package greetings

import (
    "testing"
    "regexp"
)

// TestHelloName calls greetings.Hello with a name, checking
// for a valid return value.
func TestHelloName(t *testing.T) {
    name := "Gladys"
    want := regexp.MustCompile(`\b`+name+`\b`)
    msg, err := Hello("Gladys")
    if !want.MatchString(msg) || err != nil {
        t.Errorf(`Hello("Gladys") = %q, %v, want match for %#q, nil`, msg, err, want)
    }
}

// TestHelloEmpty calls greetings.Hello with an empty string,
// checking for an error.
func TestHelloEmpty(t *testing.T) {
    msg, err := Hello("")
    if msg != "" || err == nil {
        t.Errorf(`Hello("") = %q, %v, want "", error`, msg, err)
    }
}

```

--------------------------------

### JSON Structure in Doc Comment Rendered as Code Block (Go)

Source: https://go.dev/doc/comment

Shows a Go doc comment containing a JSON structure that is rendered as an indented code block. This example emphasizes how multi-line, indented content is treated as code.

```go
// On the wire, the JSON will look something like this:
// {
//  "kind":"MyAPIObject",
//  "apiVersion":"v1",
//  "myPlugin": {
//      "kind":"PluginA",
//      "aOption":"foo",
//  },
// }

```

--------------------------------

### Go Illegal Typed Constant Conversions

Source: https://go.dev/doc/go_spec

Presents examples of illegal typed constant expressions in Go where values cannot be accurately represented by the target type, including negative values for unsigned integers and overflows for fixed-size integers.

```Go
uint(-1)     // -1 cannot be represented as a uint
int(3.14)    // 3.14 cannot be represented as an int
int64(Huge)  // 1267650600228229401496703205376 cannot be represented as an int64
Four * 300   // operand 300 cannot be represented as an int8 (type of Four)
Four * 100   // product 400 cannot be represented as an int8 (type of Four)
```

--------------------------------

### Go Selector Expression Example

Source: https://go.dev/doc/go_spec

Demonstrates the usage of selector expressions (x.f) in Go for accessing fields and methods of struct types, including those with embedded types and pointer receivers. It highlights valid and invalid selector expressions based on Go's rules.

```go
type T0 struct {
	x int
}

func (*T0) M0() {}

type T1 struct {
	y int
}

func (T1) M1() {}

type T2 struct {
	z int
	T1
	*T0
}

func (*T2) M2() {}

var t T2
var p *T2

// Valid selectors:
t.z
t.y          // equivalent to t.T1.y
t.x          // equivalent to (*t.T0).x
p.z          // equivalent to (*p).z
p.y          // equivalent to (*p).T1.y
p.x          // equivalent to (*(*p).T0).x
p.M0()

// Invalid selector example:
// q.M0() // (*q).M0 is valid but not a field selector
```

--------------------------------

### 386 Assembly: Accessing TLS and Runtime Pointers

Source: https://go.dev/doc/asm

This Go assembly snippet demonstrates how to access the thread-local storage (TLS) pointer to the 'g' structure on a 32-bit Intel 386 architecture. It utilizes the 'go_tls.h' and 'go_asm.h' headers to define the 'get_tls' macro for loading the 'g' pointer into a register (CX), then accesses 'g.m'.

```asm
#include "go_tls.h"
#include "go_asm.h"
...
get_tls(CX)
MOVL	g(CX), AX     // Move g into AX.
MOVL	g_m(AX), BX   // Move g.m into BX.


```

--------------------------------

### Function to Safely Get Map Value in Go

Source: https://go.dev/doc/effective_go

Provides a Go function that utilizes the 'comma ok' idiom to safely retrieve a value from a map. It returns the value if present, or logs an error and returns a zero value if absent.

```go
func offset(tz string) int {
    if seconds, ok := timeZone[tz]; ok {
        return seconds
    }
    log.Println("unknown time zone:", tz)
    return 0
}

```

--------------------------------

### Go Goroutine Creation with 'go' Statement

Source: https://go.dev/doc/go_spec

Demonstrates starting a new goroutine using the 'go' statement in Go. The 'go' statement executes a function call as an independent concurrent thread of control. The function's return values are discarded upon completion.

```go
go Server()
go func(ch chan<- bool) { for { sleep(10); ch <- true }} (c)
```

--------------------------------

### ARM64 Assembly: Register Usage and Addressing Modes

Source: https://go.dev/doc/asm

Details register conventions for ARM64, including the platform register (R18_PLATFORM) and reserved registers (R27, R28). R29 is the frame pointer and R30 is the link register. Explains instruction modifiers (.P, .W) and various addressing modes like shifts, scaled immediate offsets, and register pairs.

```assembly
MOVW.P
MOVW.W
```

```assembly
R0->16
R0>>16
R0<<16
R0@>16
```

```assembly
$(8<<12)
```

```assembly
8(R0)
```

```assembly
(R2)(R0)
```

```assembly
R0.UXTB
R0.UXTB<<imm
R0.UXTH
R0.UXTW
R0.UXTX
```

```assembly
R0.SXTB
R0.SXTB<<imm
R0.SXTH
R0.SXTW
R0.SXTX
```

```assembly
(R5, R6)
```

--------------------------------

### Go Struct with Conflicting Field Names (Illegal)

Source: https://go.dev/doc/go_spec

Shows an example of an illegal struct declaration in Go where field names are not unique due to the use of embedded fields. Field names within a struct must be unique.

```Go
struct {
	T     // conflicts with embedded field *T and *P.T
	*T    // conflicts with embedded field T and *P.T
	*P.T  // conflicts with embedded field T and *T
}

```

--------------------------------

### List Default GODEBUG Values

Source: https://go.dev/doc/godebug

This command retrieves the default GODEBUG settings that will be compiled into a main package. It uses the `go list` command with a specific format string to output only the default GODEBUG values. Differences from the base Go toolchain defaults are reported.

```bash
go list -f '{{.DefaultGODEBUG}}' my/main/package

```

--------------------------------

### Handle Nullable String Values in Go

Source: https://go.dev/doc/database/querying

This example shows how to handle potentially null string values returned from a database query using `sql.NullString`. It queries a single row and uses `Scan` to populate the `sql.NullString` variable. The `Valid` field is checked to determine if the value is non-null before accessing the `String` field.

```go
var s sql.NullString
err := db.QueryRow("SELECT name FROM customer WHERE id = ?", id).Scan(&s)
if err != nil {
    log.Fatal(err)
}

// Find customer name, using placeholder if not present.
name := "Valued Customer"
if s.Valid {
    name = s.String
}


```

--------------------------------

### Prepare and Execute SQL Statement in Go

Source: https://go.dev/doc/database/prepared-statements

This Go code snippet demonstrates how to prepare an SQL statement for selecting album data by ID using a placeholder. It shows `db.Prepare` to create an `sql.Stmt`, `stmt.QueryRow` to execute it with a parameter, and `Scan` to map the result to an `Album` struct. It also includes error handling and resource cleanup using `defer stmt.Close()`.

```go
// AlbumByID retrieves the specified album.
func AlbumByID(id int) (Album, error) {
    // Define a prepared statement. You'd typically define the statement
    // elsewhere and save it for use in functions such as this one.
    stmt, err := db.Prepare("SELECT * FROM album WHERE id = ?")
    if err != nil {
        log.Fatal(err)
    }
    defer stmt.Close()

    var album Album

    // Execute the prepared statement, passing in an id value for the
    // parameter whose placeholder is ?
    err := stmt.QueryRow(id).Scan(&album.ID, &album.Title, &album.Artist, &album.Price, &album.Quantity)
    if err != nil {
        if err == sql.ErrNoRows {
            // Handle the case of no rows returned.
        }
        return album, err
    }
    return album, nil
}

```

--------------------------------

### Go Reflection: Modifying Value via Pointer

Source: https://go.dev/doc/articles/laws_of_reflection

This code demonstrates the correct way to modify a value using reflection. By obtaining a reflection Value of a pointer to the target variable, and then using Elem() to get the settable value, modifications can be successfully applied.

```go
var x float64 = 3.4
p := reflect.ValueOf(&x) // Note: take the address of x.
v := p.Elem()
v.SetFloat(7.1)
fmt.Println(v.Interface())
fmt.Println(x)
```

--------------------------------

### Assigning Concrete Values to io.Reader Interface in Go

Source: https://go.dev/doc/articles/laws_of_reflection

Shows examples of assigning different concrete types (like `os.Stdin`, `bufio.NewReader`, and `bytes.Buffer`) to a variable of type `io.Reader`. This illustrates the flexibility of interfaces in Go, where a variable can hold values of any type that implements the required methods.

```go
var r io.Reader
r = os.Stdin
r = bufio.NewReader(r)
r = new(bytes.Buffer)
```

--------------------------------

### Go 'for range' with String Iteration (Unicode Code Points)

Source: https://go.dev/doc/go_spec

Shows how the 'for range' clause iterates over Unicode code points (runes) in a Go string. It provides both the byte index of the start of the rune and the rune value itself. Handles invalid UTF-8 sequences.

```Go
message := "Hello, 世界"
for index, runeValue := range message {
    // index is the byte index
    // runeValue is the Unicode code point (rune)
    println(index, string(runeValue))
}

// Example with invalid UTF-8
invalidString := "\x80abc"
for index, runeValue := range invalidString {
    // runeValue will be 0xFFFD for invalid sequences
    println(index, runeValue)
}
```

--------------------------------

### Go Union Interface Definition (Float)

Source: https://go.dev/doc/go_spec

Demonstrates the definition of a union interface in Go using the '|' operator. The 'Float' interface example shows how to represent all floating-point types, including named types with float32 or float64 underlying types.

```go
// The Float interface represents all floating-point types
// (including any named types whose underlying types are
// either float32 or float64).
type Float interface {
	~float32 | ~float64
}
```

--------------------------------

### Publish Module Index Update via Go

Source: https://go.dev/doc/modules/publishing

Updates the Go module index by listing the published module version. This command, when prefixed with `GOPROXY`, ensures that the Go proxy is aware of the new module version, making it discoverable by `go get` and other Go tools. It requires setting the `GOPROXY` environment variable.

```bash
$ GOPROXY=proxy.golang.org go list -m example.com/mymodule@v0.1.0

```

--------------------------------

### Go Assembly TEXT Directive for Function Definition

Source: https://go.dev/doc/asm

Defines a function symbol and its body using the TEXT directive. It specifies symbol name, flags (like NOSPLIT), frame size, and instructions. The function must end with a jump or RET instruction.

```goasm
TEXT runtime·profileloop(SB),NOSPLIT,$8
	MOVQ	$runtime·profileloop1(SB), CX
	MOVQ	CX, 0(SP)
	CALL	runtime·externalthreadhandler(SB)
	RET

```

--------------------------------

### Go Imports for Gin Web Service

Source: https://go.dev/doc/tutorial/web-service-gin

Imports necessary packages for a Gin web service. It includes 'net/http' for HTTP status codes and 'github.com/gin-gonic/gin' for the web framework functionalities.

```go
import (
    "net/http"

    "github.com/gin-gonic/gin"
)

```

--------------------------------

### Go vs C Variable Declaration Syntax

Source: https://go.dev/doc/go_faq

Demonstrates the difference in variable declaration syntax between Go and C, specifically for pointer types. Go's syntax is presented as clearer and more regular.

```c
int* a, b;

```

```go
var a, b *int

```

--------------------------------

### Conditional String Conversion with Type Assertion in Go

Source: https://go.dev/doc/effective_go

Presents an alternative to a type switch for handling string conversion from an interface{} value in Go. This example uses chained 'if-else if' statements with type assertions to first check for a direct string type and then for the Stringer interface.

```Go
if str, ok := value.(string); ok {
    return str
} else if str, ok := value.(Stringer); ok {
    return str.String()
}

```

--------------------------------

### Client Sends Request and Receives Response in Go

Source: https://go.dev/doc/effective_go

Demonstrates a Go client sending a request object to a server channel and waiting for the result on the request's dedicated result channel. This showcases asynchronous request-response patterns.

```Go
func sum(a []int) (s int) {
    for _, v := range a {
        s += v
    }
    return
}

request := &Request{[]int{3, 4, 5}, sum, make(chan int)}
// Send request
clientRequests <- request
// Wait for response.
fmt.Printf("answer: %d\n", <-request.resultChan)

```

--------------------------------

### Go syscall Package Additions and Fixes

Source: https://go.dev/doc/devel/weekly

Summarizes various updates to the 'syscall' package, including the addition of constants for IPv6 support, new functions like 'inotify' on Linux, and fixes for socketpair and Windows-specific values.

```go
// Added constants: IPPROTO_IPV6, IPV6_V6ONLY
// Added function: inotify on Linux
// Fixes for: socketpair (syscall_bsd), windows IPV6_V6ONLY, Utimes (Windows)
```

--------------------------------

### Appending String to Byte Slice in Go

Source: https://go.dev/doc/devel/weekly

This code example shows a new capability in Go where a string can be directly appended to a byte slice using the `append` function with the spread operator (`...`). This simplifies common string manipulation tasks.

```Go
var b []byte
var s string
b = append(b, s...)
```

--------------------------------

### Go Reflection: Indirecting Pointer to Get Settable Value

Source: https://go.dev/doc/articles/laws_of_reflection

This code shows how to use the Elem() method on a reflection Value representing a pointer. Elem() returns a new reflection Value that represents the element pointed to, which is settable if the original pointer was valid.

```go
var x float64 = 3.4
p := reflect.ValueOf(&x)
v := p.Elem()
fmt.Println("settability of v:", v.CanSet())
```

--------------------------------

### Load Page Data from File in Go

Source: https://go.dev/doc/articles/wiki/part2

This Go function, loadPage, reads page content from a text file based on the provided title. It constructs the filename by appending ".txt" to the title and uses os.ReadFile to get the file's byte slice. If the file is read successfully, it returns a pointer to a Page struct; otherwise, it returns an error.

```Go
package main

import (
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}
```

--------------------------------

### Initialize and Launch StateMonitor Goroutine

Source: https://go.dev/doc/codewalk/sharemem

Initializes the 'StateMonitor' and launches it as a separate goroutine. This monitor is responsible for storing the state of each resource and returns a channel of 'State' values.

```go
status := make(chan State)
go StateMonitor(status)
```

--------------------------------

### Go Method Refinement with Embedded Types: Job.Printf

Source: https://go.dev/doc/effective_go

Demonstrates refining or overriding methods from an embedded type. In this example, the Printf method of the embedded *log.Logger is overridden in the Job struct to include the job's command in the log output. It requires the 'fmt' and 'log' packages.

```go
func (job *Job) Printf(format string, args ...interface{}) {
    job.Logger.Printf("%q: %s", job.Command, fmt.Sprintf(format, args...))
}
```

--------------------------------

### Implement SetsockoptIPMReq() and move to winsock v2.2 in net, syscall Go

Source: https://go.dev/doc/devel/weekly

The net and syscall packages have implemented the SetsockoptIPMReq() function and migrated to Winsock v2.2. This enhances multicast support on Windows systems.

```Go
package main

import (
	"fmt"
	"net"
	"syscall"
)

func main() {
	// This example demonstrates the usage conceptually, as SetsockoptIPMReq
	// is low-level and platform-specific.

	// On Windows, this change leverages Winsock v2.2 for better multicast support.

	// Example: Creating a UDP socket (common for multicast)
	s// fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_DGRAM, syscall.IPPROTO_UDP)
	// if err != nil {
	// 	fmt.Printf("Failed to create socket: %v\n", err)
	// 	return
	// }
	// defer syscall.Close(fd)

	// The SetsockoptIPMReq function would be used here to configure multicast options.
	// The exact parameters depend on the specific
```

--------------------------------

### Import html/template Package in Go

Source: https://go.dev/doc/articles/wiki

This snippet shows how to import the html/template package along with other necessary packages like 'os' and 'net/http'. It replaces the usage of the 'fmt' package.

```go
import (
    "html/template"
    "os"
    "net/http"
)
```

--------------------------------

### Referencing GitHub Issues in Commit Messages

Source: https://go.dev/doc/contribute

This describes how to use special keywords in commit messages to automatically link and update GitHub issues. It specifies the format for direct fixes and partial updates, and highlights the need for fully-qualified syntax when working with golang.org/x/ repositories.

```git commit message
Fixes #12345
Updates #12345
Fixes golang/go#159
```

--------------------------------

### ARM Assembly: Register Usage and Addressing Modes

Source: https://go.dev/doc/asm

Explains reserved registers (R10, R11) in ARM assembly for Go. R10 points to the goroutine structure and must be referred to as 'g'. R11 is used by the linker for pseudo-operations. Covers addressing modes including shifts, rotates, and multi-register operations.

```assembly
MOVW.EQ
MOVM.IA.W
```

```assembly
R0->16
R0>>16
R0<<16
R0@>16
```

```assembly
R0->R1
R0>>R1
R0<<R1
R0@>R1
```

```assembly
[R0,g,R12-R15]
```

```assembly
(R5, R6)
```

--------------------------------

### Structure for Go Server Projects

Source: https://go.dev/doc/modules/layout

Presents a typical directory layout for Go server projects. It recommends placing server logic packages within the `internal` directory and Go commands within a `cmd` directory. This approach keeps the server self-contained and organizes non-Go files separately.

```go
project-root-directory/
  go.mod
  internal/
    auth/
      ...
    metrics/
      ...
    model/
      ...
  cmd/
    api-server/
      main.go
    metrics-analyzer/
      main.go
    ...
  ... the project's other directories with non-Go code
```

--------------------------------

### Go Assembly Instruction Constants

Source: https://go.dev/doc/asm

This snippet shows a Go constant definition for assembly instructions within the 'obj' support library for a specific architecture (e.g., ARM). These constants represent the instruction spellings known to the assembler and linker. The sequence of these names does not dictate the machine instruction encoding.

```go
const (
	AAND = obj.ABaseARM + obj.A_ARCHSPECIFIC + iota
	AEOR
	ASUB
	ARSB
	AADD
	...

)
```

--------------------------------

### s390x Assembly: Register Usage and Addressing Modes

Source: https://go.dev/doc/asm

Covers reserved registers (R10, R11) in s390x assembly, used for temporary values. R13 points to the goroutine structure and must be 'g'. R15 is the stack frame pointer, accessed via SP and FP. Details load/store multiple instructions and vector instruction usage, including addressing modes.

```assembly
LMG (R9), R5, R7
```

```assembly
XC $8, (R9), (R9)
```

```assembly
VLEIF $1, $16, V2
```

```assembly
(R5)(R6*1)
```

--------------------------------

### Handle Type Conversions with reflect.Value Getters in Go

Source: https://go.dev/doc/articles/laws_of_reflection

Explains that reflect.Value getter methods (like Uint) return the largest possible type (e.g., uint64 for uint8). This requires explicit conversion back to the original type if necessary, as shown with a uint8 example.

```go
var x uint8 = 'x'
v := reflect.ValueOf(x)
fmt.Println("type:", v.Type())                            // uint8.
fmt.Println("kind is uint8: ", v.Kind() == reflect.Uint8) // true.
x = uint8(v.Uint())                                       // v.Uint returns a uint64.
```

--------------------------------

### Godashboard Support for Non-ASCII Project Names

Source: https://go.dev/doc/devel/weekly

The godashboard tool now supports submitting projects with non-ASCII names, making it more globally inclusive.

```shell
# Example usage (conceptual)
# godashboard submit --name "你好项目"
```

--------------------------------

### Go Type Definitions: Structs and Interfaces

Source: https://go.dev/doc/go_spec

Demonstrates the creation of new distinct types in Go using struct and interface definitions. It shows how 'type' keyword binds an identifier to a new type, which is different from its underlying type. Examples include nested structs, interface definitions with methods, and type aliases.

```go
type (
	Point struct{ x, y float64 }  // Point and struct{ x, y float64 } are different types
	polar Point                   // polar and Point denote different types
)

type TreeNode struct {
	left, right *TreeNode
	value any
}

type Block interface {
	BlockSize() int
	Encrypt(src, dst []byte)
	Decrypt(src, dst []byte)
}
```

--------------------------------

### Show packages matching query at top, complete index serialization in godoc Go

Source: https://go.dev/doc/devel/weekly

The godoc tool has been enhanced to display packages matching a query at the top of search results. It also supports complete index serialization, allowing for faster indexing and retrieval of documentation.

```Go
package main

import "fmt"

func main() {
	// These are features of the godoc command-line tool or its underlying library.
	// This code snippet illustrates the concept of searching.

	query := "fmt"
	fmt.Printf("Searching for packages related to '%s'...")

	// In a real godoc scenario, the results for 'fmt' would appear at the top.
	// The tool would also leverage serialized index data for speed.

	fmt.Println("\nFeatures: Packages matching query shown first, complete index serialization supported.")
}
```

--------------------------------

### Go Generalized For Loop with Yield Function

Source: https://go.dev/doc/go_spec

Explains the generalized 'for' loop in Go (introduced in 1.22) which supports iteration using a provided 'yield' function. The loop continues as long as 'yield' returns true. This example shows a 'fibo' generator producing Fibonacci numbers.

```go
// fibo generates the Fibonacci sequence
fibo := func(yield func(x int) bool) {
	f0, f1 := 0, 1
	for yield(f0) {
		f0, f1 = f1, f0+f1
	}
}

// print the Fibonacci numbers below 1000:
for x := range fibo {
	if x >= 1000 {
		break
	}
	fmt.Printf("%d ", x)
}
// output: 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

--------------------------------

### Go: Advanced Struct and Map Formatting with Printf

Source: https://go.dev/doc/effective_go

Demonstrates advanced formatting options for structs and maps in Go using `Printf`. The `%+v` verb annotates struct fields with names, `%#v` prints values in Go syntax, and `Printf` sorts map output lexicographically by key.

```go
type T struct {
    a int
    b float64
    c string
}
t := &T{ 7, -2.35, "abc\tdef" }
fmt.Printf("%v\n", t)
fmt.Printf("%+v\n", t)
fmt.Printf("%#v\n", t)
fmt.Printf("%#v\n", timeZone)
```

--------------------------------

### Set Default Module Proxy with Fallback

Source: https://go.dev/doc/modules/managing-dependencies

This Go code snippet demonstrates setting the GOPROXY environment variable to use a specific proxy server and then fall back to direct downloads. It shows the default behavior where Go tools first attempt a public proxy and then direct repository access.

```shell
GOPROXY="https://proxy.golang.org,direct"

```

--------------------------------

### Go renderTemplate Helper Function

Source: https://go.dev/doc/articles/wiki

This Go function, 'renderTemplate', abstracts the common template parsing and execution logic used in both 'viewHandler' and 'editHandler'. It takes the writer, template name, and page data as arguments.

```go
func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
    t, _ := template.ParseFiles(tmpl + ".html")
    t.Execute(w, p)
}
```

--------------------------------

### Go Generic Function Type Inference Example

Source: https://go.dev/doc/go_spec

Demonstrates type inference for a generic Go function `dedup`. Type arguments for `S` and `E` are inferred from the assignment `s = dedup(s)`, where `s` is of type `Slice` (an alias for `[]int`). This inference relies on type assignability and constraint satisfaction.

```go
// dedup returns a copy of the argument slice with any duplicate entries removed.
func dedup[S ~[]E, E comparable](S) S { ... }

type Slice []int
var s Slice
s = dedup(s)   // same as s = dedup[Slice, int](s)
```

--------------------------------

### Go Defer for Resource Cleanup

Source: https://go.dev/doc/effective_go

Demonstrates using Go's defer statement to schedule a function call, like closing a file, to execute just before the surrounding function returns. This ensures resources are released regardless of the function's exit path.

```Go
func Contents(filename string) (string, error) {
    f, err := os.Open(filename)
    if err != nil {
        return "", err
    }
    defer f.Close()  // f.Close will run when we're finished.

    var result []byte
    buf := make([]byte, 100)
    for {
        n, err := f.Read(buf[0:])
        result = append(result, buf[0:n]...)
        if err != nil {
            if err == io.EOF {
                break
            }
            return "", err  // f will be closed if we return here.
        }
    }
    return string(result), nil // f will be closed if we return here.
}
```

--------------------------------

### Go Constants with Iota Enumerator

Source: https://go.dev/doc/effective_go

Demonstrates the use of the iota enumerator in Go to create a sequence of enumerated constants for ByteSize. This allows for defining constants like KB, MB, GB, etc., using bit shifts.

```go
type ByteSize float64

const (
    _           = iota // ignore first value by assigning to blank identifier
    KB ByteSize = 1 << (10 * iota)
    MB
    GB
    TB
    PB
    EB
    ZB
    YB
)
```

--------------------------------

### Go Function to Parse Integer from Byte Slice

Source: https://go.dev/doc/effective_go

This Go function parses an integer from a byte slice starting at a given index and returns the integer value and the next position to parse from. It skips non-digit characters before parsing and stops at non-digit characters after parsing.

```go
func nextInt(b []byte, i int) (int, int) {
    for ; i < len(b) && !isDigit(b[i]); i++ {
    }
    x := 0
    for ; i < len(b) && isDigit(b[i]); i++ {
        x = x*10 + int(b[i]) - '0'
    }
    return x, i
}
```

--------------------------------

### Go 'for' Loop Syntax Variations

Source: https://go.dev/doc/effective_go

Demonstrates the three fundamental forms of the 'for' loop in Go: C-style with initialization, condition, and post-statement; C-style while loop; and an infinite loop.

```go
// Like a C for
for init; condition; post { }

// Like a C while
for condition { }

// Like a C for(;;)
for { }
```

--------------------------------

### Go Main Function: Pig Game Simulation Execution

Source: https://go.dev/doc/codewalk/pig

The entry point for the Pig game simulation. It initializes a slice of strategies, where each strategy is an instance of `stayAtK` with a threshold from 1 to `win`. It then runs a round-robin tournament using these strategies and prints the win/loss ratio for each strategy.

```go
package main

import (
	"fmt"
)

func main() {
	strategies := make([]strategy, win)
	for k := range strategies {
		strategies[k] = stayAtK(k + 1)
	}
	wins, games := roundRobin(strategies)

	for k := range strategies {
		fmt.Printf("Wins, losses staying at k =% 4d: %s\n",
			k+1, ratioString(wins[k], games-wins[k]))
	}
}
```

--------------------------------

### Go Pig Game Simulation: `play` Function

Source: https://go.dev/doc/codewalk/pig

Simulates a single game of Pig between two strategies. It randomly determines the starting player and then iteratively applies the chosen strategy for the current player. The game continues until one player reaches the winning score. It returns the winner's index (0 or 1).

```go
package main

import (
	"math/rand"
)

// play simulates a Pig game and returns the winner (0 or 1).
func play(strategy0, strategy1 strategy) int {
	strategies := []strategy{strategy0, strategy1}
	var s score
	var turnIsOver bool
	currentPlayer := rand.Intn(2) // Randomly decide who plays first
	for s.player+s.thisTurn < win {
		action := strategies[currentPlayer](s)
		s, turnIsOver = action(s)
		if turnIsOver {
			currentPlayer = (currentPlayer + 1) % 2
		}
	}
	return currentPlayer
}
```

--------------------------------

### Go: Manipulating http.Header

Source: https://go.dev/doc/devel/weekly

This snippet illustrates the new http.Header type in Go, which replaces map[string]string for Header and Trailer fields in http.Request and http.Response. It shows how to use the Get, Set, Add, and Del methods for manipulating header values.

```Go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	header := make(http.Header)

	header.Set("Content-Type", "application/json")
	header.Add("X-Custom-Header", "value1")
	header.Add("X-Custom-Header", "value2")

	fmt.Println("Content-Type:", header.Get("Content-Type"))
	fmt.Println("X-Custom-Header:", header.Get("X-Custom-Header")) // Gets the first value
	fmt.Println("All X-Custom-Header values:", header["X-Custom-Header"])

	header.Del("X-Custom-Header")
	fmt.Println("After deleting X-Custom-Header:", header.Get("X-Custom-Header"))
}
```

--------------------------------

### Go Interface for Covariant Result Type Illustration

Source: https://go.dev/doc/go_faq

Illustrates Go's approach to method matching where types must match exactly. An interface `Copyable` defines a `Copy` method returning `interface{}`, and a `Value` type implements `Copy` returning `Value`. This example highlights that `Value` does not satisfy `Copyable` due to the return type mismatch, emphasizing Go's strictness.

```go
type Copyable interface {
    Copy() interface{}
}

func (v Value) Copy() Value
```

--------------------------------

### Go editHandler Function with html/template

Source: https://go.dev/doc/articles/wiki

This Go function, 'editHandler', demonstrates how to load a page, parse an HTML template ('edit.html'), and execute it with the page data. It replaces hard-coded HTML with templated output.

```go
func editHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/edit/"):]
    p, err := loadPage(title)
    if err != nil {
        p = &Page{Title: title}
    }
    t, _ := template.ParseFiles("edit.html")
    t.Execute(w, p)
}
```

--------------------------------

### Setting Go Executable Path in PATH Environment Variable

Source: https://go.dev/doc/code

This command appends the directory containing the Go executable to the system's PATH environment variable, allowing Go commands to be run from any directory. It dynamically determines the Go executable's location.

```bash
export PATH=$PATH:$(dirname $(go list -f '{{.Target}}' .))
```

--------------------------------

### Define 64-bit atomic load function using BYTE directives (Go/Assembly)

Source: https://go.dev/doc/asm

This snippet demonstrates how to define a 64-bit atomic load function in Go assembly. It utilizes `BYTE` directives to embed specific machine instructions for loading data atomically from memory. This approach is useful when the compiler-generated code does not include a specific instruction or for one-off implementations. The function `runtime.atomicload64` is defined, taking a pointer to a 64-bit integer and returning its value.

```goasm
TEXT runtime·atomicload64(SB), NOSPLIT, $0-12
	MOVL	ptr+0(FP), AX
	TESTL	$7, AX
	JZ	2(PC)
	MOVL	0, AX // crash with nil ptr deref
	LEAL	ret_lo+4(FP), BX
	// MOVQ (%EAX), %MM0
	BYTE $0x0f; BYTE $0x6f; BYTE $0x00
	// MOVQ %MM0, 0(%EBX)
	BYTE $0x0f; BYTE $0x7f; BYTE $0x03
	// EMMS
	BYTE $0x0F; BYTE $0x77
	RET

```

--------------------------------

### Go: Use fmt.Fprintf with io.Writer

Source: https://go.dev/doc/go_faq

Demonstrates using fmt.Fprintf with a variable that satisfies the io.Writer interface. It writes a string to the provided writer.

```go
fmt.Fprintf(w, "hello, world\n")
```

--------------------------------

### Go Slice Initialization using make

Source: https://go.dev/doc/go_spec

Shows how to create and initialize a slice with a specific length and capacity using the built-in `make` function in Go. This function allocates a new underlying array.

```Go
make([]T, length, capacity)

```

--------------------------------

### Go Album Data Initialization

Source: https://go.dev/doc/tutorial/web-service-gin

Initializes a global slice named 'albums' of the 'album' struct type. This slice is pre-populated with sample album data to be used by the web service.

```go
// albums slice to seed record album data.
var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

```

--------------------------------

### Go Method Association with Defined Types

Source: https://go.dev/doc/go_spec

Illustrates how methods can be associated with defined types in Go. It highlights that defined types do not inherit methods from their underlying types but can have their own methods defined. Examples show methods bound to a struct, a type aliased from a struct, and an embedded struct.

```go
// A Mutex is a data type with two methods, Lock and Unlock.
type Mutex struct         { /* Mutex fields */ }
func (m *Mutex) Lock()    { /* Lock implementation */ }
func (m *Mutex) Unlock()  { /* Unlock implementation */ }

// NewMutex has the same composition as Mutex but its method set is empty.
type NewMutex Mutex

// The method set of PtrMutex's underlying type *Mutex remains unchanged,
// but the method set of PtrMutex is empty.
type PtrMutex *Mutex

// The method set of *PrintableMutex contains the methods
// Lock and Unlock bound to its embedded field Mutex.
type PrintableMutex struct {
	Mutex
}

// MyBlock is an interface type that has the same method set as Block.
type MyBlock Block
```

--------------------------------

### Run Go Program with Coverage and Collect Data

Source: https://go.dev/doc/build-cover

This snippet demonstrates how to run a Go program with coverage enabled and collect the resulting data files. The `GOCOVERDIR` environment variable specifies the directory where coverage data will be stored. Multiple runs with the same `GOCOVERDIR` will append to the data.

```shell
$ mkdir somedata2
$ GOCOVERDIR=somedata2 ./myprogram.exe          // first run
I say "Hello, world." and "see ya"
$ GOCOVERDIR=somedata2 ./myprogram.exe -flag    // second run
I say "Hello, world." and "see ya"
$ ls somedata2
covcounters.890814fca98ac3a4d41b9bd2a7ec9f7f.2456041.1670259309405583534
covcounters.890814fca98ac3a4d41b9bd2a7ec9f7f.2456047.1670259309410891043
covmeta.890814fca98ac3a4d41b9bd2a7ec9f7f
$ 

```

--------------------------------

### Send Multiple Dependent Git Commits with `git codereview mail HEAD`

Source: https://go.dev/doc/contribute

This command is used to send multiple dependent Git commits stacked in a single branch for review in Gerrit. It requires explicit specification of `HEAD` to ensure all stacked commits are considered. This is useful for advanced users who want to group related changes.

```shell
git codereview mail HEAD
```

--------------------------------

### Define a Main Package for Executable

Source: https://go.dev/doc/modules/layout

Sets up the 'main' package for a Go executable command. All files within the root directory declaring 'package main' contribute to the final executable. This is essential for building command-line tools.

```go
package main

// ... main function and other code here
```

--------------------------------

### Go: Mandatory if Statement Condition

Source: https://go.dev/doc/devel/weekly

This snippet demonstrates the change in Go's if statement syntax. Previously, an if statement could omit its condition, defaulting to true. This version requires an explicit condition, with examples showing how to achieve the same effect as the old syntax.

```Go
package main

import "fmt"

func foo() string {
	return "bar"
}

func main() {
	// Old, now illegal syntax:
	// if x := foo(); {
	// 	fmt.Println("This code is always executed.")
	// }

	// New equivalent: explicit true condition
	if x := foo(); true {
		fmt.Println("This code is always executed.")
	}

	// Another equivalent: using a block
	{
		x := foo()
		fmt.Println("This code is also always executed.")
	}
}
```

--------------------------------

### Go: Avoiding Recursion in Custom String() Method

Source: https://go.dev/doc/effective_go

Illustrates a common pitfall when implementing the `String() string` method in Go: infinite recursion caused by calling `fmt.Sprintf` in a way that invokes the `String` method again. It provides corrected examples showing how to properly handle string conversions to prevent recursion.

```go
type MyString string

func (m MyString) String() string {
    return fmt.Sprintf("MyString=%s", m) // Error: will recur forever.
}

type MyString string
func (m MyString) String() string {
    return fmt.Sprintf("MyString=%s", string(m)) // OK: note conversion.
}
```

--------------------------------

### Go Code Comments: Deprecation Notices

Source: https://go.dev/doc/comment

Shows how to format deprecation notices in Go code comments. Paragraphs starting with 'Deprecated:' are treated as deprecation notices, providing information about the deprecation and suggesting alternatives. These notices can appear anywhere in a doc comment and may lead to tools warning about deprecated identifier usage.

```go
// Package rc4 implements the RC4 stream cipher.
//
// Deprecated: RC4 is cryptographically broken and should not be used
// except for compatibility with legacy systems.
//
// This package is frozen and no new functionality will be added.
package rc4

// Reset zeros the key data and makes the Cipher unusable.
//
// Deprecated: Reset can't guarantee that the key will be entirely removed from
// the process's memory.
func (c *Cipher) Reset()

```

--------------------------------

### Go: Labeled Composite Literals

Source: https://go.dev/doc/effective_go

Illustrates the use of labeled fields in Go composite literals. This allows initializers to be specified in any order and omits fields, leaving them as their zero values.

```go
return &File{fd: fd, name: name}

```

--------------------------------

### Execute Command with Older API (Go)

Source: https://go.dev/doc/devel/weekly

This snippet illustrates the older API for executing external commands in Go using the exec package. It shows the more verbose method involving manual buffer handling and process waiting. This is provided for comparison with the newer, simplified API.

```go
args := []string{"diff", "-u", "file1.txt", "file2.txt"}
	p, err := exec.Run("/usr/bin/diff", args, os.Environ(), "",
		exec.DevNull, exec.Pipe, exec.DevNull)
	if err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	io.Copy(&buf, p.Stdout)
	w, err := p.Wait(0)
	p.Close()
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), err
```

--------------------------------

### Go Floating-Point FMA Examples

Source: https://go.dev/doc/go_spec

Demonstrates scenarios where Go's implementation may use fused multiply-add (FMA) instructions for floating-point arithmetic. FMA is allowed when intermediate results are not explicitly rounded, enabling potential performance gains. Conversely, it shows cases where FMA is disallowed because it would omit necessary rounding.

```go
// FMA allowed for computing r, because x*y is not explicitly rounded:
r  = x*y + z
r  = z;   r += x*y
t  = x*y; r = t + z
*p = x*y; r = *p + z
r  = x*y + float64(z)

// FMA disallowed for computing r, because it would omit rounding of x*y:
r  = float64(x*y) + z
r  = z; r += float64(x*y)
t  = float64(x*y); r = t + z

```

--------------------------------

### Go Package Declaration

Source: https://go.dev/doc/tutorial/web-service-gin

Declares the package as 'main', which is necessary for standalone executable Go programs. This is the first statement in any Go source file.

```go
package main

```

--------------------------------

### Go template package: New formatter signature and multi-word instantiation

Source: https://go.dev/doc/devel/weekly

Illustrates the updated function signature for formatter types in the Go `template` package, which now accepts multiple arguments. It also shows the enhanced capability for multi-word variable instantiation within templates, allowing for more complex data handling.

```Go
func(wr io.Writer, formatter string, data ...interface{})
```

```Go
Before:
        {field}
        {field|formatter}

Now:
        {field1 field2 field3}
        {field1 field2 field3|formatter}
```

--------------------------------

### Run Tool using go tool (full path)

Source: https://go.dev/doc/modules/managing-dependencies

Executes a Go tool using its full package path. This is necessary when multiple tools share a path fragment or when the fragment matches a Go distribution tool.

```bash
$ go tool golang.org/x/tools/cmd/stringer
```

--------------------------------

### Initialize Go Module

Source: https://go.dev/doc/modules/gomod-ref

Initializes a new Go module by creating a go.mod file. It sets the module path, which serves as the unique identifier and import prefix for the module's packages. This command is the first step in managing dependencies for a new Go project.

```bash
$ go mod init example/mymodule
```

--------------------------------

### Go Function Declaration Syntax

Source: https://go.dev/doc/articles/gos_declaration_syntax

Demonstrates the syntax for declaring functions in Go, including parameters and return types. It emphasizes the left-to-right readability.

```Go
func main(argc int, argv []string) int
func main(int, []string) int
```

--------------------------------

### Updating Import Paths for Major Go Module Versions

Source: https://go.dev/doc/modules/major-version

This example shows how to update import statements within Go code when a module undergoes a major version update. The major version number must be appended to the module path portion of each import statement. This ensures that code correctly references packages from the new major version of the module.

```go
// Old import statement:
// import "example.com/mymodule/package1"

// New import statement:
import "example.com/mymodule/v2/package1"
```

--------------------------------

### Go Function to C Function Equivalence

Source: https://go.dev/doc/install/gccgo

Shows the conceptual equivalence between a Go function returning multiple values and a C function returning a struct. The Go function's type is a pointer to a struct representing the function's code and closure.

```go
func GoFunction(int) (int, float64)
```

```c
struct { int i; float64 f; } CFunction(int, void*)
```

--------------------------------

### Go: Interface Definition for Copyable Type

Source: https://go.dev/doc/faq

This Go code defines an interface `Copyable` with a single method `Copy` that returns an empty interface (`interface{}`). This example is used to illustrate Go's strict type matching for methods. It highlights that a method returning a specific type (like `Value`) will not satisfy an interface method that requires a return type of `interface{}` unless the types match exactly, contrasting with covariant result types found in other languages.

```go
type Copyable interface {
    Copy() interface{}
}
```

--------------------------------

### Importing Packages for Side Effects in Go

Source: https://go.dev/doc/effective_go

Demonstrates how to import a package solely for its side effects, such as initialization or registration, using the blank identifier as the package name. This is useful when a package's functionality is needed without directly referencing its exported API.

```go
import _ "net/http/pprof"

```

--------------------------------

### Go Allocation with 'new' Primitive

Source: https://go.dev/doc/effective_go

Explains Go's `new` function for memory allocation. It allocates zeroed storage for a new value of the specified type and returns a pointer to it, but does not initialize the memory beyond zeroing.

```Go
type SyncedBuffer struct {
    lock    sync.Mutex
    buffer  bytes.Buffer
}

p := new(SyncedBuffer)  // type *SyncedBuffer
var v SyncedBuffer      // type  SyncedBuffer
```

--------------------------------

### Module Path Structure

Source: https://go.dev/doc/modules/managing-dependencies

Illustrates the common structure for a Go module path, consisting of a prefix (originating from a repository or controlled name) and a descriptive text for the module's purpose.

```text
<prefix>/<descriptive-text>
```

--------------------------------

### Set LD_LIBRARY_PATH for Go Packages

Source: https://go.dev/doc/install/gccgo

Configures the `LD_LIBRARY_PATH` environment variable to include the directory where compiled Go packages are located. This is necessary for runtime access to shared libraries like `libgo.so`.

```bash
LD_LIBRARY_PATH=${prefix}/lib/gcc/MACHINE/VERSION
[or]
LD_LIBRARY_PATH=${prefix}/lib64/gcc/MACHINE/VERSION
export LD_LIBRARY_PATH
```

--------------------------------

### Exposing Go Function to C with Custom Name

Source: https://go.dev/doc/install/gccgo

Illustrates how to specify a custom name for a Go function when it is called from C. This uses the GCC `__asm__` extension to map the Go function's internal name to an external C-callable name.

```c
extern int go_function(int) __asm__ ("myprefix.mypackage.Function");

```

--------------------------------

### Set GODEBUG Defaults with //go:debug Directives

Source: https://go.dev/doc/godebug

This snippet demonstrates how to configure GODEBUG settings using `//go:debug` directives at the top of a Go source file. This offers more fine-grained control than go.mod/go.work directives, applying them to the specific package. Each setting should appear only once per file, and unrecognized settings are treated as errors in Go 1.21 and later. Older toolchains ignore these directives.

```go
//go:debug default=go1.21
//go:debug panicnil=1
//go:debug asynctimerchan=0

```

--------------------------------

### Go: Handling Large Unsigned Integers with printf

Source: https://go.dev/doc/effective_go

Shows how Go's `Printf` handles large unsigned 64-bit integers (`uint64`) and their signed equivalents (`int64`) using `%d` and `%x` format specifiers. The formatting routines automatically determine signedness and size based on the argument's type, differing from C's `printf` which requires explicit flags.

```go
var x uint64 = 1<<64 - 1
fmt.Printf("%d %x; %d %x\n", x, x, int64(x), int64(x))
```

--------------------------------

### Go 'switch' Statement with General Expressions

Source: https://go.dev/doc/effective_go

Demonstrates the flexibility of Go's 'switch' statement, which can evaluate general expressions, making it suitable for replacing complex if-else chains. It also shows switching on 'true' for a common pattern.

```go
func unhex(c byte) byte {
    switch {
    case '0' <= c && c <= '9':
        return c - '0'
    case 'a' <= c && c <= 'f':
        return c - 'a' + 10
    case 'A' <= c && c <= 'F':
        return c - 'A' + 10
    }
    return 0
}
```

--------------------------------

### Go: String and Byte Slice Formatting with %q and %x

Source: https://go.dev/doc/effective_go

Explains Go's `%q` format verb for quoted string or rune representation and `%#q` for backquoted strings. It also covers `%x` for hexadecimal output of strings, byte arrays, and slices, including spaced output with `% x`.

```go
fmt.Printf("%q\n", "abc\tdef")
fmt.Printf("%#q\n", "abc\tdef")
fmt.Printf("%x\n", "abc\tdef")
fmt.Printf("% x\n", "abc\tdef")
```

--------------------------------

### Go Rune Type Introduction and Testing

Source: https://go.dev/doc/devel/weekly

Explains the introduction of the 'rune' type as an alias for 'int', intended for Unicode code points. A future change will alias 'rune' to 'int32'. The document suggests using 'rune' consistently and provides instructions on how to test code for 'rune' safety using the GOEXPERIMENT=rune32 flag and the govet tool.

```Shell
GOEXPERIMENT=rune32 ./all.bash
```

--------------------------------

### Go Markov Chain - Chain Type and Methods

Source: https://go.dev/doc/codewalk_fileprint=%2Fdoc%2Fcodewalk%2Fmarkov

Defines the 'Chain' type, which holds the Markov chain data (a map of prefixes to suffixes) and the prefix length. Includes methods to create a new chain, build it from input, and generate text.

```Go
// Chain contains a map ("chain") of prefixes to a list of suffixes.
// A prefix is a string of prefixLen words joined with spaces.
// A suffix is a single word. A prefix can have multiple suffixes.
type Chain struct {
	chain     map[string][]string
	prefixLen int
}

// NewChain returns a new Chain with prefixes of prefixLen words.
func NewChain(prefixLen int) *Chain {
	return &Chain{make(map[string][]string), prefixLen}
}

// Build reads text from the provided Reader and
// parses it into prefixes and suffixes that are stored in Chain.
func (c *Chain) Build(r io.Reader) {
	br := bufio.NewReader(r)
	p := make(Prefix, c.prefixLen)
	for {
		var s string
		if _, err := fmt.Fscan(br, &s); err != nil {
			break
		}
		key := p.String()
		c.chain[key] = append(c.chain[key], s)

		p.Shift(s)

	}
}

// Generate returns a string of at most n words generated from Chain.
func (c *Chain) Generate(n int) string {
	p := make(Prefix, c.prefixLen)
	var words []string
	for i := 0; i < n; i++ {
		choices := c.chain[p.String()]
		if len(choices) == 0 {
			break
		}
		next := choices[rand.Intn(len(choices))]
		words = append(words, next)
		p.Shift(next)
	}
	return strings.Join(words, " ")
}
```

--------------------------------

### Convert Go Binary Coverage Data to Legacy Text Format

Source: https://go.dev/doc/build-cover

This command converts binary coverage data files into the legacy text format using `go tool covdata textfmt`. The output file (`profile.txt`) can then be used with `go tool cover` for further analysis, such as generating function-level or HTML reports. The `-o` flag specifies the output file name.

```shell
$ go tool covdata textfmt -i=somedata -o profile.txt
$ cat profile.txt
mode: set
mydomain.com/myprogram.go:10.13,12.2 1 1
mydomain.com/greetings/greetings.go:3.23,5.2 1 1
$ go tool cover -func=profile.txt
mydomain.com/greetings/greetings.go:3:  Goodbye     100.0%
mydomain.com/myprogram.go:10:       main        100.0%
total:                  (statements)    100.0%
$ 

```

--------------------------------

### Update 'hello' module dependencies

Source: https://go.dev/doc/tutorial/call-module-code

The 'go mod tidy' command synchronizes the 'hello' module's dependencies. It adds any missing dependencies required by the code, such as the 'example.com/greetings' module, and updates the go.mod file.

```shell
$ go mod tidy
go: found example.com/greetings in example.com/greetings v0.0.0-00010101000000-000000000000
```

--------------------------------

### Go log.Println Implementation

Source: https://go.dev/doc/effective_go

The log.Println function passes its arguments directly to fmt.Sprintln for formatting. It uses the `v...` syntax to unpack the variadic slice `v` into individual arguments for the nested function call.

```go
// Println prints to the standard logger in the manner of fmt.Println.
func Println(v ...interface{}) {
    std.Output(2, fmt.Sprintln(v...))  // Output takes parameters (int, string)
}
```

--------------------------------

### Set Module Proxy with Comma Fallback

Source: https://go.dev/doc/modules/managing-dependencies

This Go code snippet shows how to configure multiple module proxy servers using a comma as a separator. If the first proxy returns an HTTP 404 or 410 error, Go tools will attempt the next proxy in the list.

```shell
GOPROXY="https://proxy.example.com,https://proxy2.example.com"

```

--------------------------------

### Load Page Function (Initial) in Go

Source: https://go.dev/doc/articles/wiki

Provides an initial implementation of `loadPage` which takes a title, constructs a filename, reads the file content using `os.ReadFile`, and returns a pointer to a new `Page` struct. It currently discards potential errors from `os.ReadFile` using the blank identifier `_`.

```go
func loadPage(title string) *Page {
    filename := title + ".txt"
    body, _ := os.ReadFile(filename)
    return &Page{Title: title, Body: body}
}

```

--------------------------------

### Launch GDB with GOROOT Path

Source: https://go.dev/doc/gdb

Command to launch GDB and specify the GOROOT path using the '-d' flag. This helps GDB locate the Go runtime sources and support scripts for better debugging.

```bash
gdb regexp.test -d $GOROOT
```

--------------------------------

### C: Function Declaration (Original and Modern)

Source: https://go.dev/doc/articles/gos_declaration_syntax

Shows the original C syntax for function declaration, followed by the modern C syntax. Both demonstrate how the return type precedes the function signature, and argument types are specified.

```c
int main(argc, argv)
    int argc;
    char *argv[];
{
    /* ... */
}

int main(int argc, char *argv[]) { /* ... */ }

```

--------------------------------

### Go http.HandleFunc Shortcut

Source: https://go.dev/doc/devel/weekly

Illustrates the `http.HandleFunc` function, a convenient shortcut for registering handlers in Go's HTTP package. It simplifies the process of associating a URL path with a function.

```Go
http.HandleFunc("/path", HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    // handler logic
}))
```

--------------------------------

### Check Go Telemetry Environment Variables

Source: https://go.dev/doc/telemetry

Retrieves information about the current Go telemetry configuration using environment variables. `GOTELEMETRY` shows the mode, and `GOTELEMETRYDIR` indicates the configuration directory.

```bash
go env GOTELEMETRY
go env GOTELEMETRYDIR
```

--------------------------------

### Go: Define pointer and value methods

Source: https://go.dev/doc/go_faq

Shows the syntax for defining methods on a pointer receiver (*MyStruct) and a value receiver (MyStruct). This is crucial for understanding method behavior and mutability.

```go
func (s *MyStruct) pointerMethod() { }
func (s MyStruct)  valueMethod()   { }
```

--------------------------------

### Add OpenBSD environment configuration in http/cgi Go

Source: https://go.dev/doc/devel/weekly

The http/cgi package has been updated to include environment configuration specific to OpenBSD. This enhances compatibility and correct operation when running Go CGI applications on OpenBSD systems.

```Go
package main

import "fmt"

func main() {
	// This change affects the http/cgi package, specifically how it configures
	// the environment when running CGI scripts.
	// The addition of OpenBSD configuration ensures correct behavior on that platform.

	fmt.Println("http/cgi package updated with OpenBSD environment configuration.")
	// In a real CGI script, this would influence environment variables set for the script.
}
```

--------------------------------

### Opening MySQL Database Handle with Structured Configuration

Source: https://go.dev/doc/database/open-handle

This Go snippet demonstrates a more readable approach to opening a MySQL database handle. It utilizes the `mysql.NewConfig()` function to define connection properties in a structured manner (user, password, network, address, database name) and then uses `cfg.FormatDSN()` to generate the connection string for `sql.Open`. This method improves code maintainability and organization of database credentials.

```go
// Specify connection properties.
cfg := mysql.NewConfig()
cfg.User = username
cfg.Passwd = password
cfg.Net = "tcp"
cfg.Addr = "127.0.0.1:3306"
cfg.DBName = "jazzrecords"

// Get a database handle.
db, err = sql.Open("mysql", cfg.FormatDSN())
if err != nil {
    log.Fatal(err)
}

```

--------------------------------

### Go: Template Rendering and Path Validation

Source: https://go.dev/doc/articles/wiki/final_m=text

Handles HTML template rendering using `html/template` and validates URL paths with regular expressions. `template.Must` is used for parsing templates, and `regexp.MustCompile` for path matching. Errors during rendering are reported via `http.Error`.

```Go
var templates = template.Must(template.ParseFiles("edit.html", "view.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var validPath = regexp.MustCompile("^/(edit|save|view)/([a-zA-Z0-9]+)$")

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		fn(w, r, m[2])
	}
}
```

--------------------------------

### Initialize Temporary Module Path

Source: https://go.dev/doc/modules/gomod-ref

Demonstrates initializing a Go module with a temporary module path. This is useful when the final repository location is unknown, allowing development to proceed with a placeholder path that ensures uniqueness.

```bash
go mod init <company-name>/stringtools
```

--------------------------------

### List Available Dependency Updates with go list

Source: https://go.dev/doc/modules/managing-dependencies

The `go list -m -u` command helps discover newer versions of your project's dependencies. It can list all available updates for all dependencies or for a specific module.

```bash
$ go list -m -u all

```

```bash
$ go list -m -u example.com/theirmodule

```

--------------------------------

### Update Main Function to Call albumsByArtist in Go

Source: https://go.dev/doc/tutorial/database-access

Modifies the main Go function to call the 'albumsByArtist' function with a specific artist name ('John Coltrane') and logs any errors encountered. It then prints the retrieved album data.

```go
albums, err := albumsByArtist("John Coltrane")
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Albums found: %v\n", albums)

```

--------------------------------

### Configure Gin Router for Album Endpoints

Source: https://go.dev/doc/tutorial/web-service-gin

Go code to configure the Gin router in the main function. It sets up routes for retrieving all albums, adding albums, and retrieving a specific album by ID.

```go
func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)

    router.Run("localhost:8080")
}
```

--------------------------------

### Regexp Package Speed and Simplification

Source: https://go.dev/doc/devel/weekly

The regexp package has been optimized for performance, achieving approximately a 30% speed increase. The code for handling brackets has also been simplified.

```Go
import "regexp"

// ... regexp.Compile("[a-z]+") ...
```

--------------------------------

### Manage Go Workspace Version Requirements with `go work`

Source: https://go.dev/doc/toolchain

The `go work` command suite helps manage Go version requirements within a workspace defined by `go.work` files. Commands like `go work use`, `go work init`, and `go work sync` ensure the `go.work` file's version is compatible with all modules in the workspace. `go work edit` can be used to remove toolchain lines.

```bash
go work use
go work init
go work sync
go work edit -toolchain=none
```

--------------------------------

### Go: HTTP Request Handlers for Wiki

Source: https://go.dev/doc/articles/wiki/final_m=text

Implements HTTP handlers for viewing, editing, and saving wiki pages. It uses `http.Redirect` for navigation and `http.Error` for reporting server errors. Page data is loaded and saved using the `Page` struct methods. Dependencies include `net/http` and `html/template`.

```Go
func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		http.Redirect(w, r, "/edit/"+title, http.StatusFound)
		return
	}
	renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}

func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")
	p := &Page{Title: title, Body: []byte(body)}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/view/"+title, http.StatusFound)
}
```

--------------------------------

### Importing a Go Package

Source: https://go.dev/doc/modules/managing-dependencies

This snippet demonstrates how to import an external Go package into your project. The 'go' command, after enabling dependency tracking, will fetch the specified package.

```go
import "rsc.io/quote"

```

--------------------------------

### Push Git Tag to Origin

Source: https://go.dev/doc/modules/publishing

Pushes the newly created Git tag to the remote origin repository. This action makes the version tag accessible to collaborators and CI/CD systems, completing the versioning step.

```bash
$ git push origin v0.1.0

```

--------------------------------

### Set Module Proxy with Pipe Fallback

Source: https://go.dev/doc/modules/managing-dependencies

This Go code snippet demonstrates setting multiple module proxy servers using a pipe as a separator. Go tools will try the next URL in the list regardless of the HTTP error code returned by the current proxy.

```shell
GOPROXY="https://proxy.example.com|https://proxy2.example.com"

```

--------------------------------

### New os/inotify Package

Source: https://go.dev/doc/devel/weekly

A new package, os/inotify, has been added to the Go standard library. This package provides an interface to the Linux inotify subsystem for file system event monitoring.

```Go
import "os/inotify"

// ... inotify.NewListener() ...
```

--------------------------------

### Configuring Go Data Race Detector with GORACE Environment Variable

Source: https://go.dev/doc/articles/race_detector

Shows how to configure the Go data race detector's behavior using the `GORACE` environment variable, including options like log path, exit code, and path stripping.

```bash
GORACE="option1=val1 option2=val2"

$ GORACE="log_path=/tmp/race/report strip_path_prefix=/my/go/sources/" go test -race
```

--------------------------------

### StartTLS Argument Change in smtp package

Source: https://go.dev/doc/devel/weekly

The StartTLS function in the smtp package now accepts a *tls.Config argument. This change allows for more configuration options when establishing a TLS connection.

```Go
smtp.StartTLS(config *tls.Config)
```

--------------------------------

### Go Built-in Bootstrapping Functions

Source: https://go.dev/doc/go_spec

Signatures and descriptions for built-in functions like 'print' and 'println' in Go, useful during bootstrapping. These functions are primarily for output and are not guaranteed to remain in the language.

```go
Function   Behavior

print      prints all arguments; formatting of arguments is implementation-specific
println    like print but prints spaces between arguments and a newline at the end
```

--------------------------------

### View updated 'hello' module go.mod file

Source: https://go.dev/doc/tutorial/call-module-code

Displays the content of the 'go.mod' file for the 'hello' module after running 'go mod edit' and 'go mod tidy'. It includes the module path, Go version, a replace directive for the local dependency, and a require directive for the dependency.

```go
module example.com/hello

go 1.16

replace example.com/greetings => ../greetings

require example.com/greetings v0.0.0-00010101000000-000000000000
```

--------------------------------

### Go Goroutine Recovery with Panic and Recover

Source: https://go.dev/doc/effective_go

This snippet demonstrates how to use `defer` and `recover` within a goroutine to catch panics, log the error, and allow the goroutine to exit cleanly without affecting other running goroutines. It's useful for server applications where individual worker failures should not bring down the entire service.

```Go
func server(workChan <-chan *Work) {
    for work := range workChan {
        go safelyDo(work)
    }
}

func safelyDo(work *Work) {
    defer func() {
        if err := recover(); err != nil {
            log.Println("work failed:", err)
        }
    }()
    do(work)
}
```

--------------------------------

### Checkout Specific Go Release using Git

Source: https://go.dev/doc/devel/release

This command allows you to fetch all tags from the Go repository and then check out a specific release version. This is useful for working with or inspecting older versions of Go.

```bash
git fetch --tags
git checkout _goX.Y.Z_
```

--------------------------------

### Go: Basic Error Handling with `os.Open`

Source: https://go.dev/doc/articles/error_handling

This Go code snippet demonstrates how to open a file using `os.Open` and handle potential errors. If an error occurs (i.e., `err` is not nil), `log.Fatal` is called to print the error message and terminate the program.

```go
f, err := os.Open("filename.ext")
if err != nil {
    log.Fatal(err)
}
// do something with the open *File f

```

--------------------------------

### Go: Composite Literals for Arrays, Slices, and Maps

Source: https://go.dev/doc/effective_go

Demonstrates creating composite literals for arrays, slices, and maps in Go. Field labels are used as indices for arrays/slices and keys for maps.

```go
a := [...]string   {Enone: "no error", Eio: "Eio", Einval: "invalid argument"}
s := []string      {Enone: "no error", Eio: "Eio", Einval: "invalid argument"}
m := map[int]string{Enone: "no error", Eio: "Eio", Einval: "invalid argument"}

```

--------------------------------

### Run Tool using go tool (short path)

Source: https://go.dev/doc/modules/managing-dependencies

Executes a Go tool using the last non-major-version component of its import path. This is suitable when there are no path conflicts.

```bash
$ go tool stringer
```

--------------------------------

### Go Min Function with Variadic Integers

Source: https://go.dev/doc/effective_go

The Min function illustrates a variadic parameter of a specific type (`...int`). It finds the minimum value from a list of integers passed as arguments. The largest possible integer is used for initialization.

```go
func Min(a ...int) int {
    min := int(^uint(0) >> 1)  // largest int
    for _, i := range a {
        if i < min {
            min = i
        }
    }
    return min
}
```

--------------------------------

### Albums API

Source: https://go.dev/doc/tutorial/web-service-gin

Endpoints for accessing and managing a collection of vintage jazz albums.

```APIDOC
## GET /albums

### Description
Retrieves a list of all albums, returned in JSON format.

### Method
GET

### Endpoint
/albums

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **albums** (array) - A list of album objects.
  - **id** (string) - The unique identifier for the album.
  - **artist** (string) - The artist of the album.
  - **title** (string) - The title of the album.
  - **release_date** (string) - The release date of the album.
  - **label** (string) - The record label of the album.

#### Response Example
```json
[
  {
    "id": "1",
    "artist": "Thelonious Monk",
    "title": "Monk's Dream",
    "release_date": "1963",
    "label": "Columbia Records"
  }
]
```
```

```APIDOC
## POST /albums

### Description
Adds a new album to the collection. The album data is sent as JSON in the request body.

### Method
POST

### Endpoint
/albums

### Parameters
None

#### Request Body
- **artist** (string) - Required - The artist of the album.
- **title** (string) - Required - The title of the album.
- **release_date** (string) - Required - The release date of the album.
- **label** (string) - Required - The record label of the album.

### Request Example
```json
{
  "artist": "John Coltrane",
  "title": "A Love Supreme",
  "release_date": "1965",
  "label": "Impulse! Records"
}
```

### Response
#### Success Response (201)
- **message** (string) - Confirmation message indicating the album was added.

#### Response Example
```json
{
  "message": "Album added successfully."
}
```
```

```APIDOC
## GET /albums/:id

### Description
Retrieves a specific album by its unique ID.

### Method
GET

### Endpoint
/albums/:id

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the album to retrieve.

### Request Example
None

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the album.
- **artist** (string) - The artist of the album.
- **title** (string) - The title of the album.
- **release_date** (string) - The release date of the album.
- **label** (string) - The record label of the album.

#### Response Example
```json
{
  "id": "1",
  "artist": "Thelonious Monk",
  "title": "Monk's Dream",
  "release_date": "1963",
  "label": "Columbia Records"
}
```

#### Error Response (404)
- **error** (string) - Message indicating the album was not found.

#### Error Response Example
```json
{
  "error": "Album not found."
}
```
```

--------------------------------

### Go 'for...range' Loop for Unicode Characters

Source: https://go.dev/doc/effective_go

Explains how the 'range' clause handles UTF-8 encoded strings in Go, iterating over Unicode code points (runes) and demonstrating handling of erroneous encodings.

```go
for pos, char := range "日本\x80語" { // \x80 is an illegal UTF-8 encoding
    fmt.Printf("character %#U starts at byte position %d\n", char, pos)
}
```

--------------------------------

### Using Go Tool covdata to Generate Percent Statements Covered Report

Source: https://go.dev/doc/build-cover

This command uses `go tool covdata percent` to generate a report on the percentage of statements covered for each instrumented package. It requires the `-i` flag to specify the directory containing the coverage data files. The output shows package names and their statement coverage percentages.

```shell
$ go tool covdata percent -i=somedata
    main    coverage: 100.0% of statements
    mydomain.com/greetings  coverage: 100.0% of statements
$ 

```

--------------------------------

### Go Type Documentation: bytes.Buffer

Source: https://go.dev/doc/comment

Documents the `bytes.Buffer` type and its associated constructor functions and methods. It explains that `Buffer` is a variable-sized byte buffer with `Read` and `Write` methods, and that its zero value is an empty buffer ready for use.

```Go
package bytes // import "bytes"

type Buffer struct {
    // Has unexported fields.
}
    A Buffer is a variable-sized buffer of bytes with Read and Write methods.
    The zero value for Buffer is an empty buffer ready to use.

func NewBuffer(buf []byte) *Buffer
func NewBufferString(s string) *Buffer
func (b *Buffer) Bytes() []byte
func (b *Buffer) Cap() int
func (b *Buffer) Grow(n int)
func (b *Buffer) Len() int
func (b *Buffer) Next(n int) []byte
func (b *Buffer) Read(p []byte) (n int, err error)
func (b *Buffer) ReadByte() (byte, error)
...
```

--------------------------------

### Go 'for' Loop with Short Declaration

Source: https://go.dev/doc/effective_go

Illustrates using a short variable declaration for the loop index within a C-style 'for' loop, commonly used for simple iterative tasks.

```go
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}
```

--------------------------------

### Flush Implementation in compress/flate

Source: https://go.dev/doc/devel/weekly

The compress/flate package now implements the Flush function, which is equivalent to zlib's Z_SYNC_FLUSH. This allows for more control over the compression stream.

```Go
import "compress/flate"

// ...
writer, _ := flate.NewWriter(outputStream, flate.BestCompression)
// ...
writer.Flush()
// ...
```

--------------------------------

### Managing Go Module Cache

Source: https://go.dev/doc/code

Provides the command to clean the Go module cache. This removes all downloaded modules from the 'pkg/mod' directory, which can be useful for freeing up disk space or resolving caching issues.

```bash
go clean -modcache
```

--------------------------------

### Go Type Documentation: Documenting Exported Fields

Source: https://go.dev/doc/comment

Shows two approaches for documenting exported fields of a struct. The first approach includes explanations within the type's doc comment, as seen with LimitedReader. The second approach relies on per-field comments, as demonstrated with Printer.

```go
package io

// A LimitedReader reads from R but limits the amount of
// data returned to just N bytes. Each call to Read
// updates N to reflect the new amount remaining.
// Read returns EOF when N <= 0.
type LimitedReader struct {
    R   Reader // underlying reader
    N   int64  // max bytes remaining
}
```

```go
package comment

// A Printer is a doc comment printer.
// The fields in the struct can be filled in before calling
// any of the printing methods
// in order to customize the details of the printing process.
type Printer struct {
    // HeadingLevel is the nesting level used for
    // HTML and Markdown headings.
    // If HeadingLevel is zero, it defaults to level 3,
    // meaning to use <h3> and ###.
    HeadingLevel int
    ...
}
```

--------------------------------

### Go viewHandler Function with html/template

Source: https://go.dev/doc/articles/wiki

This Go function, 'viewHandler', loads a page, parses an HTML template ('view.html'), and executes it with the page data, similar to 'editHandler'.

```go
func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, _ := loadPage(title)
    t, _ := template.ParseFiles("view.html")
    t.Execute(w, p)
}
```

--------------------------------

### Running Go Tests with a Specific Toolchain Version

Source: https://go.dev/doc/toolchain

This command demonstrates how to force the 'go test' command to use a specific Go toolchain version, such as 'go1.21rc3', by setting the GOTOOLCHAIN environment variable. This is useful for testing compatibility with different Go versions.

```bash
GOTOOLCHAIN=go1.21rc3 go test

```

--------------------------------

### Updating strconv Interface (Go)

Source: https://go.dev/doc/devel/weekly

The strconv package has been updated to provide a more idiomatic and efficient interface. Client code can be automatically updated using `gofix`. Refer to the package documentation for detailed changes.

```Go
http://weekly.golang.org/pkg/strconv/

```

--------------------------------

### Go View Handler Implementation

Source: https://go.dev/doc/articles/wiki

A simplified Go handler for viewing a page. It loads the page content based on the title and renders a template. If the page is not found, it redirects to the edit page.

```go
func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
    p, err := loadPage(title)
    if err != nil {
        http.Redirect(w, r, "/edit/"+title, http.StatusFound)
        return
    }
    renderTemplate(w, "view", p)
}
```

--------------------------------

### Handle cgo and // +build comments in go/build Go

Source: https://go.dev/doc/devel/weekly

The go/build package now correctly handles cgo directives and '// +build' comments. This improves the package's ability to determine build constraints and dependencies for Go projects, especially those using cgo.

```Go
package main

/*
#cgo CFLAGS: -I/usr/local/include
#cgo LDFLAGS: -L/usr/local/lib -lmylib
import "C"
*/
import "C"

// +build !windows

import (
	"fmt"
	"go/build"
	"runtime"
)

func main() {
	ctx := build.Context{GOOS: runtime.GOOS, GOARCH: runtime.GOARCH}
	// The go/build package's logic for detecting cgo and build tags is improved.
	// This example doesn't directly show the improved logic but relies on it.

	pkg, err := ctx.Import("os", "", build.FindOnly)
	if err != nil {
		fmt.Printf("Error importing package: %v\n", err)
		return
	}

	fmt.Printf("Successfully processed package context. Build tags and cgo handling improved.\n")
	fmt.Printf("Package import path: %s\n", pkg.ImportPath)
}
```

--------------------------------

### Go: Returning Address of Composite Literal

Source: https://go.dev/doc/effective_go

Shows how to directly return the address of a composite literal in Go. This is a concise way to initialize and return a new instance, leveraging that local variable storage persists after function return.

```go
return &File{fd, name, nil, 0}

```

--------------------------------

### Go Package Variable Initialization Order

Source: https://go.dev/doc/go_spec

Demonstrates the stepwise initialization of package-level variables based on declaration order and dependencies. Multiple variables on the left-hand side of an assignment are initialized together.

```Go
var x = a
var a, b = f() // a and b are initialized together, before x is initialized
```

--------------------------------

### Go viewHandler Using renderTemplate

Source: https://go.dev/doc/articles/wiki

This modified 'viewHandler' function utilizes the 'renderTemplate' helper function to display page content, reducing code duplication.

```go
func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, _ := loadPage(title)
    renderTemplate(w, "view", p)
}
```

--------------------------------

### Storing Database Credentials using Environment Variables in Go

Source: https://go.dev/doc/database/open-handle

Illustrates a secure method for storing database credentials by reading them from environment variables using os.Getenv. This approach avoids hardcoding sensitive information directly in the Go source code, enhancing security. It's also convenient for local testing.

```go
username := os.Getenv("DB_USER")
password := os.Getenv("DB_PASS")
```

--------------------------------

### Go: Printing Any Value with %v and %T

Source: https://go.dev/doc/effective_go

Illustrates the versatility of Go's `%v` format verb, which prints any value in a default format, including complex types like maps and structs. It also shows the `%T` verb for printing the type of a value.

```go
fmt.Printf("%v\n", timeZone)  // or just fmt.Println(timeZone)
fmt.Printf("%T\n", timeZone)
```

--------------------------------

### Go Clean Function Documentation for Path Manipulation

Source: https://go.dev/doc/comment

This snippet details the documentation for the Clean function in Go's path package. It explains the function's purpose of returning the shortest equivalent path name through lexical processing and lists the iterative rules applied. It also mentions an external reference and the function signature.

```go
package path

// Clean returns the shortest path name equivalent to path
// by purely lexical processing. It applies the following rules
// iteratively until no further processing can be done:
//
//  1. Replace multiple slashes with a single slash.
//  2. Eliminate each . path name element (the current directory).
//  3. Eliminate each inner .. path name element (the parent directory)
//     along with the non-.. element that precedes it.
//  4. Eliminate .. elements that begin a rooted path:
//     that is, replace "/.." by "/" at the beginning of a path.
//
// The returned path ends in a slash only if it is the root "/".
//
// If the result of this process is an empty string, Clean
// returns the string ".".
//
// See also Rob Pike, “[Lexical File Names in Plan 9].”
//
// [Lexical File Names in Plan 9]: https://9p.io/sys/doc/lexnames.html
func Clean(path string) string {
    ...
}

```

--------------------------------

### Go PublicSuffixList Interface Documentation

Source: https://go.dev/doc/comment

This snippet shows the documentation for the PublicSuffixList interface in Go's url package. It includes a detailed explanation of its purpose, security considerations, and a reference to an external implementation. It is intended for use within Go source files.

```go
package url

// PublicSuffixList provides the public suffix of a domain. For example:
//   - the public suffix of "example.com" is "com",
//   - the public suffix of "foo1.foo2.foo3.co.uk" is "co.uk", and
//   - the public suffix of "bar.pvt.k12.ma.us" is "pvt.k12.ma.us".
//
// Implementations of PublicSuffixList must be safe for concurrent use by
// multiple goroutines.
//
// An implementation that always returns "" is valid and may be useful for
// testing but it is not secure: it means that the HTTP server for foo.com can
// set a cookie for bar.com.
//
// A public suffix list implementation is in the package
// golang.org/x/net/publicsuffix.
type PublicSuffixList interface {
    ...
}

```

--------------------------------

### Go editHandler Using renderTemplate

Source: https://go.dev/doc/articles/wiki

This modified 'editHandler' function also uses the 'renderTemplate' helper function for consistency and code reduction.

```go
func editHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/edit/"):]
    p, err := loadPage(title)
    if err != nil {
        p = &Page{Title: title}
    }
    renderTemplate(w, "edit", p)
}
```

--------------------------------

### Go Printf Function Signature

Source: https://go.dev/doc/effective_go

The signature of the Printf function demonstrates the use of `...interface{}` to accept an arbitrary number of arguments of any type. This allows for flexible formatting similar to C's printf.

```go
func Printf(format string, v ...interface{}) (n int, err error) {

}
```

--------------------------------

### Standard Error Output for print/println

Source: https://go.dev/doc/devel/weekly

The print and println bootstrapping functions now direct their output to standard error. To write to standard output, developers should use fmt.Print[ln].

```Go
fmt.Print("to stdout")
println("to stderr")
```

--------------------------------

### Go Gin Album List Handler

Source: https://go.dev/doc/tutorial/web-service-gin

Implements a handler function 'getAlbums' using the Gin framework. This function retrieves the global 'albums' slice, serializes it into indented JSON, and sends it as an HTTP response with a 200 OK status.

```go
// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

```

--------------------------------

### Build Go Package With DWARF Location Lists

Source: https://go.dev/doc/diagnostics

Builds a Go package with optimizations enabled but includes DWARF location lists using the -gcflags '-dwarflocationlists=true' flag. This flag, introduced in Go 1.10, helps debuggers work better with optimized binaries.

```bash
$ go build -gcflags="-dwarflocationlists=true"
```

--------------------------------

### Go 'for...range' Loop for Maps

Source: https://go.dev/doc/effective_go

Shows how to iterate over a map using the 'range' clause in Go, accessing both the key and value for each element.

```go
for key, value := range oldMap {
    newMap[key] = value
}
```

--------------------------------

### Serving pprof Handlers on a Custom Path in Go

Source: https://go.dev/doc/diagnostics

This Go code snippet demonstrates how to serve pprof profiling handlers on a custom port and path using the `net/http` and `net/pprof` packages. It registers the `pprof.Profile` handler to a specific path, allowing for custom endpoint configuration for profiling data collection.

```go
package main

import (
	"log"
	"net/http"
	"net/http/pprof"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/custom_debug_path/profile", pprof.Profile)
	log.Fatal(http.ListenAndServe(":7777", mux))
}
```

--------------------------------

### Go Simpler Counter Server Implementation (Integer)

Source: https://go.dev/doc/effective_go

A more concise counter server implementation in Go, using an integer type directly. The receiver is a pointer to allow modification of the integer.

```go
// Simpler counter server.
type Counter int

func (ctr *Counter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    *ctr++
    fmt.Fprintf(w, "counter = %d\n", *ctr)
}
```

--------------------------------

### Go Argument Server Function

Source: https://go.dev/doc/effective_go

A function in Go that prints the command-line arguments used when invoking the server binary. This function can be adapted to serve HTTP requests.

```go
// Argument server.
func ArgServer(w http.ResponseWriter, req *http.Request) {
    fmt.Fprintln(w, os.Args)
}
```

--------------------------------

### Pretty Print Go Slices in GDB

Source: https://go.dev/doc/gdb

Demonstrates how GDB's pretty printing works for Go slices. It shows the initial output and how to dereference runtime representations to inspect elements. Relies on GDB's built-in pretty printing for Go types.

```gdb
(gdb) p utf
$22 =  []uint8 = {0 '\000', 0 '\000', 0 '\000', 0 '\000'}
```

```gdb
(gdb) p slc
$11 =  []int = {0, 0}
```

```gdb
(gdb) p slc->
_ array  slc    len
```

```gdb
(gdb) p slc->array
$12 = (int *) 0xf84057af00
```

```gdb
(gdb) p slc->array[1]
$13 = 0
```

--------------------------------

### Write a Go Test for ReverseRunes Function

Source: https://go.dev/doc/code

This Go code defines a test function `TestReverseRunes` for a `morestrings` package. It uses a slice of structs to define test cases with input and expected output strings. The function iterates through these cases, calls the `ReverseRunes` function, and uses `t.Errorf` to report failures if the got output does not match the want output. This requires the `testing` package.

```go
package morestrings

import "testing"

func TestReverseRunes(t *testing.T) {
    cases := []struct {
        in, want string
    }{
        {"Hello, world", "dlrow ,olleH"},
        {"Hello, 世界", "界世 ,olleH"},
        {"", ""},
    }
    for _, c := range cases {
        got := ReverseRunes(c.in)
        if got != c.want {
            t.Errorf("ReverseRunes(%q) == %q, want %q", c.in, got, c.want)
        }
    }
}
```

--------------------------------

### Using sort.IntSlice for Sequence Sorting and Printing in Go

Source: https://go.dev/doc/effective_go

Illustrates an idiomatic Go approach to handle sorting and printing for a custom Sequence type. Instead of Sequence implementing multiple interfaces, it leverages type conversion to sort.IntSlice for sorting and then to []int for printing, showcasing effective use of type conversion.

```Go
type Sequence []int

// Method for printing - sorts the elements before printing
func (s Sequence) String() string {
    s = s.Copy()
    sort.IntSlice(s).Sort()
    return fmt.Sprint([]int(s))
}

```

--------------------------------

### Render Template with Caching in Go

Source: https://go.dev/doc/articles/wiki

This Go code snippet demonstrates rendering a template using a pre-parsed template cache. It calls the ExecuteTemplate method on the global 'templates' variable, passing the writer, template name, and page data. This is more efficient than parsing files on every render.

```Go
func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
    err := templates.ExecuteTemplate(w, tmpl+".html", p)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}
```

--------------------------------

### List Source Code in GDB

Source: https://go.dev/doc/gdb

GDB command to display the current source code context. This is equivalent to listing the current location in the source file.

```gdb
l
```

--------------------------------

### Go Struct Formatting with Gofmt

Source: https://go.dev/doc/effective_go

Demonstrates how the gofmt tool automatically formats Go struct declarations by aligning comments. This ensures consistent code style without manual effort. Gofmt handles indentation and vertical alignment for comments.

```go
type T struct {
    name string // name of the object
    value int // its value
}

type T struct {
    name    string // name of the object
    value   int    // its value
}

```

--------------------------------

### Go Standard Variable Declarations

Source: https://go.dev/doc/go_spec

Demonstrates various ways to declare variables in Go using the 'var' keyword. Includes declarations with types, initializers, and grouped declarations.

```go
var i int
var U, V, W float64
var k = 0
var x, y float32 = -1, -2
var (
	i       int
	u, v, s = 2.0, 3.0, "bar"
)
var re, im = complexSqrt(-1)  // map lookup; only interested in "found"
var _, found = entries[name]
```

```go
var d = math.Sin(0.5)  // d is float64
var i = 42             // i is int
var t, ok = x.(T)      // t is T, ok is bool
var n = nil            // illegal
```

--------------------------------

### Upgrade Go Dependency to Specific Version

Source: https://go.dev/doc/tutorial/govulncheck

This command upgrades a specific Go module, `golang.org/x/text`, to version `v0.3.8`. It directly addresses identified vulnerabilities by ensuring the project uses a patched version. The output confirms the successful upgrade from the previous version to the specified one.

```bash
$ go get golang.org/x/text@v0.3.8

```

```bash
go: upgraded golang.org/x/text v0.3.5 => v0.3.8

```

--------------------------------

### Go Function Documentation: strings.HasPrefix

Source: https://go.dev/doc/comment

Documents the `HasPrefix` function in the `strings` package, which reports whether a given string `s` begins with a specified `prefix`. It follows the convention of using 'reports whether' for boolean-returning functions.

```Go
package strings

// HasPrefix reports whether the string s begins with prefix.
func HasPrefix(s, prefix string) bool
```

--------------------------------

### Implement HTTP View Handler in Go

Source: https://go.dev/doc/articles/wiki/part2

This Go code sets up an HTTP handler function, viewHandler, to display page content. It extracts the page title from the request URL, loads the corresponding page using the loadPage function, and then formats the title and body into an HTML response. The handler is registered with the http.HandleFunc function.

```Go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/view/"):]
	p, _ := loadPage(title)
	fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", p.Title, p.Body)
}

func main() {
	http.HandleFunc("/view/", viewHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

--------------------------------

### Type Switch for String Conversion in Go

Source: https://go.dev/doc/effective_go

Shows a simplified type switch implementation similar to fmt.Printf's internal logic for converting an interface{} value to a string. It handles cases where the value is already a string or implements the Stringer interface, demonstrating flexible interface handling.

```Go
type Stringer interface {
    String() string
}

var value interface{} // Value provided by caller.
switch str := value.(type) {
case string:
    return str
case Stringer:
    return str.String()
}

```

--------------------------------

### Go 'switch' Statement with Comma-Separated Cases

Source: https://go.dev/doc/effective_go

Illustrates how multiple cases in a Go 'switch' statement can be combined into a single list separated by commas, simplifying checks for multiple values.

```go
func shouldEscape(c byte) bool {
    switch c {
    case ' ', '?', '&', '=', '#', '+', '%':
        return true
    }
    return false
}
```

--------------------------------

### Go: Page Struct and File Operations

Source: https://go.dev/doc/articles/wiki/final_m=text

Defines a `Page` struct to hold page title and body, along with methods for saving to and loading from files. It uses `os.WriteFile` and `os.ReadFile` for persistence. Errors during file operations are returned.

```Go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore

package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"regexp"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}
```

--------------------------------

### ELF and Mach-O .o File Linking Support

Source: https://go.dev/doc/devel/weekly

The 6l and 8l linkers now support linking ELF and Mach-O object files (.o files). This enhances the flexibility of the linking process for different object file formats.

```shell
# Example linking command (conceptual)
ld -o program elf_object.o macho_object.o
```

--------------------------------

### Go: Call greeting function with a name

Source: https://go.dev/doc/tutorial/random-greeting

This Go code demonstrates how to call the `Hello` function from the `greetings` package with a specific name ('Gladys') and handle any potential errors. It configures logging to prefix messages and disable timestamp/file information. Dependencies include 'fmt', 'log', and the custom 'example.com/greetings' package.

```go
package main

import (
    "fmt"
    "log"

    "example.com/greetings"
)

func main() {
    // Set properties of the predefined Logger, including
    // the log entry prefix and a flag to disable printing
    // the time, source file, and line number.
    log.SetPrefix("greetings: ")
    log.SetFlags(0)

    // Request a greeting message.
    message, err := greetings.Hello("Gladys")
    // If an error was returned, print it to the console and
    // exit the program.
    if err != nil {
        log.Fatal(err)
    }

    // If no error was returned, print the returned message
    // to the console.
    fmt.Println(message)
}

```

--------------------------------

### Call Multiple Greetings Function in Go

Source: https://go.dev/doc/tutorial/greetings-multiple-people

Demonstrates how to call the `Hellos` function from the `greetings` package. It initializes a slice of names, calls `Hellos` to retrieve a map of greetings, and handles any errors. The resulting map is then printed to the console. This code is part of the main application that utilizes the greetings module.

```go
package main

import (
    "fmt"
    "log"

    "example.com/greetings"
)

func main() {
    // Set properties of the predefined Logger, including
    // the log entry prefix and a flag to disable printing
    // the time, source file, and line number.
    log.SetPrefix("greetings: ")
    log.SetFlags(0)

    // A slice of names.
    names := []string{"Gladys", "Samantha", "Darrin"}

    // Request greeting messages for the names.
    messages, err := greetings.Hellos(names)
    if err != nil {
        log.Fatal(err)
    }
    // If no error was returned, print the returned map of
    // messages to the console.
    fmt.Println(messages)
}

```

--------------------------------

### Go Gin RESTful Web Service: Album Management API

Source: https://go.dev/doc/tutorial/web-service-gin

This Go code defines a RESTful web service using the Gin framework to manage a collection of albums. It includes endpoints for listing all albums, retrieving an album by its ID, and adding a new album to the collection. The service uses JSON for request and response bodies and runs on localhost:8080.

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

// album represents data about a record album.
type album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)

    router.Run("localhost:8080")
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
    var newAlbum album

    // Call BindJSON to bind the received JSON to
    // newAlbum.
    if err := c.BindJSON(&newAlbum); err != nil {
        return
    }

    // Add the new album to the slice.
    albums = append(albums, newAlbum)
    c.IndentedJSON(http.StatusCreated, newAlbum)
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
    id := c.Param("id")

    // Loop through the list of albums, looking for
    // an album whose ID value matches the parameter.
    for _, a := range albums {
        if a.ID == id {
            c.IndentedJSON(http.StatusOK, a)
            return
        }
    }
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

```

--------------------------------

### Http ServeFile Handles Range Header

Source: https://go.dev/doc/devel/weekly

The http package's ServeFile function now correctly handles the Range header for partial requests, allowing clients to request specific byte ranges of a file.

```Go
http.ServeFile(w, r, "path/to/your/file.txt")
```

--------------------------------

### Create Go caller module structure

Source: https://go.dev/doc/tutorial/call-module-code

This snippet illustrates the directory structure for a Go project with two modules: 'greetings' and 'hello'. The 'hello' directory contains the code that will call functions from the 'greetings' module.

```shell
<home>/
 |-- greetings/
 |-- hello/
```

--------------------------------

### Go: Constructor Function using Composite Literal

Source: https://go.dev/doc/effective_go

Simplifies a Go constructor function using a composite literal, reducing boilerplate code. Composite literals create new instances of a type.

```go
func NewFile(fd int, name string) *File {
    if fd < 0 {
        return nil
    }
    f := File{fd, name, nil, 0}
    return &f
}

```

--------------------------------

### Go Handler for POST Albums Request

Source: https://go.dev/doc/tutorial/web-service-gin

This Go function handles POST requests to the /albums endpoint using the Gin framework. It binds JSON data from the request body to an 'album' struct, appends it to a global 'albums' slice, and returns the created album with a 201 status.

```go
// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
    var newAlbum album

    // Call BindJSON to bind the received JSON to
    // newAlbum.
    if err := c.BindJSON(&newAlbum); err != nil {
        return
    }

    // Add the new album to the slice.
    albums = append(albums, newAlbum)
    c.IndentedJSON(http.StatusCreated, newAlbum)
}

```

--------------------------------

### Query Multiple Rows with Go's database/sql

Source: https://go.dev/doc/database/querying

This function demonstrates how to query for multiple rows from a database using `db.Query`. It iterates over the results using `rows.Next` and scans each row into an `Album` struct. Error handling and resource management with `defer rows.Close()` are included. This pattern is common for fetching collections of records.

```go
func albumsByArtist(artist string) ([]Album, error) {
    rows, err := db.Query("SELECT * FROM album WHERE artist = ?", artist)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    // An album slice to hold data from returned rows.
    var albums []Album

    // Loop through rows, using Scan to assign column data to struct fields.
    for rows.Next() {
        var alb Album
        if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist,
            &alb.Price, &alb.Quantity); err != nil {
            return albums, err
        }
        albums = append(albums, alb)
    }
    if err = rows.Err(); err != nil {
        return albums, err
    }
    return albums, nil
}

```

--------------------------------

### Query Album by ID in Go

Source: https://go.dev/doc/tutorial/database-access

Retrieves a single album from the database by its unique ID. It handles cases where the album is not found or other database errors occur during the query or scanning process. Dependencies include the `database/sql` and `fmt` packages.

```go
// albumByID queries for the album with the specified ID.
func albumByID(id int64) (Album, error) {
    // An album to hold data from the returned row.
    var alb Album

    row := db.QueryRow("SELECT * FROM album WHERE id = ?", id)
    if err := row.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
        if err == sql.ErrNoRows {
            return alb, fmt.Errorf("albumsById %d: no such album", id)
        }
        return alb, fmt.Errorf("albumsById %d: %v", id, err)
    }
    return alb, nil
}

// Hard-code ID 2 here to test the query.
alb, err := albumByID(2)
if err != nil {
    log.Fatal(err)
}
fmt.Printf("Album found: %v\n", alb)
```

--------------------------------

### Main function for Markov Chain text generator

Source: https://go.dev/doc/codewalk/markov_m=text

The main function orchestrates the Markov chain text generation process. It parses command-line flags for the number of words to generate and the prefix length, seeds the random number generator, initializes a new Chain, builds it from standard input, generates text, and prints it to standard output.

```go
func main() {
	// Register command-line flags.
	numWords := flag.Int("words", 100, "maximum number of words to print")
	prefixLen := flag.Int("prefix", 2, "prefix length in words")

	flag.Parse()                     // Parse command-line flags.
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator.

	c := NewChain(*prefixLen)     // Initialize a new Chain.
	c.Build(os.Stdin)             // Build chains from standard input.
	text := c.Generate(*numWords) // Generate text.
	fmt.Println(text)             // Write text to standard output.
}
```

--------------------------------

### GDB Info Args Command

Source: https://go.dev/doc/gdb

Use 'info args' to list the arguments passed to the current function. This is crucial for verifying that the correct values were supplied to a function, aiding in debugging logic errors.

```gdb
(gdb) info args
t = 0xf840688b60
```

--------------------------------

### List Specific File and Line in GDB

Source: https://go.dev/doc/gdb

GDB command to display source code from a specific file and line number. This allows precise navigation within the source code.

```gdb
l regexp.go:1
```

--------------------------------

### Creating Slices, Maps, and Channels with make in Go

Source: https://go.dev/doc/go_spec

The 'make' built-in function is used to initialize slices, maps, and channels. For slices, it specifies length and capacity. For maps, it provides an initial capacity hint. For channels, it defines buffer size. It returns a value of the specified type T, not a pointer.

```Go
s := make([]int, 10, 100)       // slice with len(s) == 10, cap(s) == 100
s := make([]int, 1e3)           // slice with len(s) == cap(s) == 1000
c := make(chan int, 10)         // channel with a buffer size of 10
m := make(map[string]int, 100)  // map with initial space for approximately 100 elements
```

--------------------------------

### Configure Git for HTTPS Authentication with Personal Access Token

Source: https://go.dev/doc/go_faq

This snippet shows how to configure Git to authenticate over HTTPS using a personal access token for GitHub. It involves modifying the `$HOME/.netrc` file. This method is useful when standard ports are restricted.

```shell
machine github.com login *USERNAME* password *APIKEY*
```

--------------------------------

### Collect and Analyze Go Runtime Traces

Source: https://go.dev/doc/diagnostics

Command to collect and analyze runtime traces for Go programs. This tool helps detect latency and utilization problems by visualizing runtime events like scheduling, syscalls, and garbage collections.

```bash
go tool trace
```

--------------------------------

### Go Loop to Iterate and Print Integers from Byte Slice

Source: https://go.dev/doc/effective_go

Shows how to use the `nextInt` function in a loop to extract and print all integers found within a byte slice. It correctly updates the index for subsequent calls to `nextInt`.

```go
for i := 0; i < len(b) {
    x, i = nextInt(b, i)
    fmt.Println(x)
}
```

--------------------------------

### C: Pointer and Array Declarations

Source: https://go.dev/doc/articles/gos_declaration_syntax

Illustrates C syntax for declaring a pointer to an integer ('p') and an array of integers ('a'). It shows how the asterisk denotes a pointer and square brackets denote an array, based on expression types.

```c
int *p;
int a[3];

```

--------------------------------

### Opening Database with sql.OpenDB using MySQL Connector in Go

Source: https://go.dev/doc/database/open-handle

Demonstrates how to open a database handle using sql.OpenDB with driver-specific connection properties for MySQL. It configures connection settings like user, password, network address, and database name, then obtains a connector and passes it to sql.OpenDB. This method is useful for leveraging driver-specific connection features.

```go
cfg := mysql.NewConfig()
cfg.User = username
cfg.Passwd = password
cfg.Net = "tcp"
cfg.Addr = "127.0.0.1:3306"
cfg.DBName = "jazzrecords"

connector, err := mysql.NewConnector(&cfg)
if err != nil {
    log.Fatal(err)
}

db = sql.OpenDB(connector)
```

--------------------------------

### Go: Implement random greeting selection

Source: https://go.dev/doc/tutorial/random-greeting

This Go code adds a `randomFormat` function to select a random greeting format from a slice and uses it in the `Hello` function. It handles potential errors if no name is provided. Dependencies include the 'errors', 'fmt', and 'math/rand' packages.

```go
package greetings

import (
    "errors"
    "fmt"
    "math/rand"
)

// Hello returns a greeting for the named person.
func Hello(name string) (string, error) {
    // If no name was given, return an error with a message.
    if name == "" {
        return name, errors.New("empty name")
    }
    // Create a message using a random format.
    message := fmt.Sprintf(randomFormat(), name)
    return message, nil
}

// randomFormat returns one of a set of greeting messages. The returned
// message is selected at random.
func randomFormat() string {
    // A slice of message formats.
    formats := []string{
        "Hi, %v. Welcome!",
        "Great to see you, %v!",
        "Hail, %v! Well met!",
    }

    // Return a randomly selected message format by specifying
    // a random index for the slice of formats.
    return formats[rand.Intn(len(formats))]
}

```

--------------------------------

### Build Go Binary for Debugging

Source: https://go.dev/doc/gdb

Command to build a Go executable for debugging purposes. This command ensures that debug information is generated, which is necessary for GDB to effectively debug the Go runtime.

```bash
go test -c
```

--------------------------------

### Go Client Goroutine for Buffer Management

Source: https://go.dev/doc/effective_go

This Go client goroutine manages a pool of buffers using a buffered channel to represent a free list. It attempts to retrieve a buffer from the free list; if none is available, it allocates a new one. The buffer is then used to load data and sent to a server channel.

```Go
var freeList = make(chan *Buffer, 100)
var serverChan = make(chan *Buffer)

func client() {
    for {
        var b *Buffer
        // Grab a buffer if available; allocate if not.
        select {
        case b = <-freeList:
            // Got one; nothing more to do.
        default:
            // None free, so allocate a new one.
            b = new(Buffer)
        }
        load(b)              // Read next message from the net.
        serverChan <- b      // Send to server.
    }
}
```

--------------------------------

### Send Initial Resources to Pending Channel

Source: https://go.dev/doc/codewalk/sharemem

A goroutine is launched to allocate and send initial 'Resource' objects to the 'pending' channel. This is necessary because unbuffered channel operations are synchronous.

```go
go func() {
	for _, url := range urls {
		pending <- &Resource{URL: url}
	}
}()
```

--------------------------------

### C: Function Pointer Declaration

Source: https://go.dev/doc/articles/gos_declaration_syntax

Demonstrates the C syntax for declaring a pointer 'fp' to a function that takes two integers and returns an integer. This highlights the complexity of C's declaration syntax for function pointers.

```c
int (*fp)(int a, int b);

```

--------------------------------

### GODEBUG: Default Go 1.21 with Old panicnil Behavior

Source: https://go.dev/doc/modules/gomod-ref

Shows how to use the default GODEBUG settings from Go 1.21 while retaining the older 'panicnil=1' behavior. This is useful for maintaining compatibility or testing specific older behaviors.

```bash
godebug (
    default=go1.21
    panicnil=1
)

```

--------------------------------

### Handle error returned from greetings module in Go

Source: https://go.dev/doc/tutorial/handle-errors

This Go code demonstrates how to handle errors returned from the greetings.Hello function. It configures the log package, calls Hello with an empty string to trigger an error, and uses log.Fatal to print the error and exit if one occurs. Otherwise, it prints the greeting.

```go
package main

import (
    "fmt"
    "log"

    "example.com/greetings"
)

func main() {
    // Set properties of the predefined Logger, including
    // the log entry prefix and a flag to disable printing
    // the time, source file, and line number.
    log.SetPrefix("greetings: ")
    log.SetFlags(0)

    // Request a greeting message.
    message, err := greetings.Hello("")
    // If an error was returned, print it to the console and
    // exit the program.
    if err != nil {
        log.Fatal(err)
    }

    // If no error was returned, print the returned message
    // to the console
    fmt.Println(message)
}

```

--------------------------------

### Go 'for' Loop with Parallel Assignment

Source: https://go.dev/doc/effective_go

Shows how to use parallel assignment in a 'for' loop for managing multiple loop variables, suitable for reversing slices or similar operations where `++` and `--` are not directly applicable to multiple variables.

```go
// Reverse a
for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
    a[i], a[j] = a[j], a[i]
}
```

--------------------------------

### Go 'for...range' Loop with Key Only

Source: https://go.dev/doc/effective_go

Demonstrates iterating over a map when only the key is needed, omitting the value by not providing a second variable in the 'range' clause.

```go
for key := range m {
    if key.expired() {
        delete(m, key)
    }
}
```

--------------------------------

### Access and Fetch Values from Go Map

Source: https://go.dev/doc/effective_go

Shows how to access and fetch values from a Go map using a key. If the key is not present, it returns the zero value for the map's value type.

```go
offset := timeZone["EST"]

```

--------------------------------

### Go: Handling Loop Variable Capture in Goroutines

Source: https://go.dev/doc/go_faq

Demonstrates how to correctly capture loop variables when using closures as goroutines in Go. It highlights the issue with shared loop variables and provides solutions using argument passing or variable shadowing to ensure each goroutine operates on its intended value.

```Go
package main

import (
	"fmt"
)

func main() {
	done := make(chan bool)

	values := []string{"a", "b", "c"}
	for _, v := range values {
		// Solution 1: Pass variable as an argument
		go func(u string) {
			fmt.Println(u)
			done <- true
		}(v)
	}

	// wait for all goroutines to complete before exiting
	for _ = range values {
		<-done
	}
}

```

```Go
package main

import (
	"fmt"
)

func main() {
	done := make(chan bool)

	values := []string{"a", "b", "c"}
	for _, v := range values {
		// Solution 2: Create a new variable for each iteration
		v := v // create a new 'v'.
		go func() {
			fmt.Println(v)
			done <- true
		}()
	}

	// wait for all goroutines to complete before exiting
	for _ = range values {
		<-done
	}
}

```

--------------------------------

### Implement Chain for Markov Model

Source: https://go.dev/doc/codewalk/markov_m=text

Defines a 'Chain' struct to hold the Markov model, consisting of a map where keys are string representations of prefixes and values are slices of possible suffix words. It includes a constructor 'NewChain' and methods to 'Build' the chain from input text and 'Generate' new text.

```go
// Chain contains a map ("chain") of prefixes to a list of suffixes.
// A prefix is a string of prefixLen words joined with spaces.
// A suffix is a single word. A prefix can have multiple suffixes.
type Chain struct {
	chain     map[string][]string
	prefixLen int
}

// NewChain returns a new Chain with prefixes of prefixLen words.
func NewChain(prefixLen int) *Chain {
	return &Chain{make(map[string][]string), prefixLen}
}

// Build reads text from the provided Reader and
// parses it into prefixes and suffixes that are stored in Chain.
func (c *Chain) Build(r io.Reader) {
	br := bufio.NewReader(r)
	p := make(Prefix, c.prefixLen)
	for {
		var s string
		if _, err := fmt.Fscan(br, &s); err != nil {
			break
		}
		key := p.String()
		c.chain[key] = append(c.chain[key], s)
		p.Shift(s)
	}
}

// Generate returns a string of at most n words generated from Chain.
func (c *Chain) Generate(n int) string {
	p := make(Prefix, c.prefixLen)
	var words []string
	for i := 0; i < n; i++ {
		choices := c.chain[p.String()]
		if len(choices) == 0 {
			break
		}
		next := choices[rand.Intn(len(choices))]
		words = append(words, next)
		p.Shift(next)
	}
	return strings.Join(words, " ")
}
```

--------------------------------

### Go Code Comments: Links (Reference Style)

Source: https://go.dev/doc/comment

Demonstrates the use of reference-style links in Go code comments. Link targets are defined in separate sections using the format '[Text]: URL'. Within the comment, '[Text]' creates a hyperlink. gofmt moves these definitions to the end of the doc comment.

```go
// Package json implements encoding and decoding of JSON as defined in
// [RFC 7159]. The mapping between JSON and Go values is described
// in the documentation for the Marshal and Unmarshal functions.
//
// For an introduction to this package, see the article
// “[JSON and Go].”
//
// [RFC 7159]: https://tools.ietf.org/html/rfc7159
// [JSON and Go]: https://golang.org/doc/articles/json_and_go.html
package json

```

--------------------------------

### Go path: Windows support for Split

Source: https://go.dev/doc/devel/weekly

This documentation indicates that the `path.Split` function in Go now includes support for Windows operating systems. This enhancement ensures consistent path manipulation behavior across different platforms, particularly addressing Windows-specific path conventions.

```Go
path: Windows support for Split (thanks Benny Siegert).
```

--------------------------------

### Go Init Function Declaration

Source: https://go.dev/doc/go_spec

Shows the syntax for declaring an init function within a Go package. Init functions are special and are executed after package-level variables are initialized.

```Go
func init() { ... }
```

--------------------------------

### Go String Struct Definition

Source: https://go.dev/doc/install/gccgo

Defines the internal structure of a Go string when interacting with C. This is subject to change in future Go versions. It consists of a pointer to data and its length.

```c
struct __go_string {
  const unsigned char *__data;
  intptr_t __length;
};

```

--------------------------------

### C: Basic Integer Declaration

Source: https://go.dev/doc/articles/gos_declaration_syntax

A simple C declaration for an integer variable 'x'. This demonstrates the basic C syntax where the type precedes the variable name.

```c
int x;

```

--------------------------------

### Support serializing file sets in go/token Go

Source: https://go.dev/doc/devel/weekly

The go/token package now supports serializing file sets. This feature allows for the saving and loading of file set information, which is crucial for tools that analyze or manipulate Go source code.

```Go
package main

import (
	"fmt"
	"go/token"
)

func main() {
	fset := token.NewFileSet()
	// Add some files to the file set
	fset.AddFile("file1.go", fset.Base(), 100)
	fset.AddFile("file2.go", fset.Base(), 200)

	// The ability to serialize/deserialize fset is now supported.
	// This is typically done using gob encoding or similar mechanisms.

	// Example: conceptual serialization (actual implementation would use encoding/gob)
	// var buf bytes.Buffer
	// enc := gob.NewEncoder(&buf)
	// err := enc.Encode(fset)

	fmt.Println("go/token package now supports serialization of file sets.")
	fmt.Printf("Number of files in the set: %d\n", fset.Len())
}
```

--------------------------------

### Configure Private Module Sources

Source: https://go.dev/doc/modules/managing-dependencies

This Go code snippet illustrates how to set the GOPRIVATE environment variable to specify module prefixes that should not be requested from any proxy. This is useful for accessing private repositories.

```shell
GOPRIVATE=*.corp.example.com,*.research.example.com

```

--------------------------------

### Initialize Cached Templates in Go

Source: https://go.dev/doc/articles/wiki

This Go code snippet initializes a global variable 'templates' by parsing multiple HTML template files. It uses template.Must, which panics if parsing fails, ensuring that the program exits if templates cannot be loaded. This approach is fundamental for template caching.

```Go
var templates = template.Must(template.ParseFiles("edit.html", "view.html"))
```

--------------------------------

### Addition of govet Static Checker

Source: https://go.dev/doc/devel/weekly

A new tool named govet has been added to the Go distribution. Govet performs static analysis on Go programs, currently focusing on checking arguments passed to print calls.

```shell
govet <your_program.go>
```

--------------------------------

### POST /albums - Add Album

Source: https://go.dev/doc/tutorial/web-service-gin

Adds a new album to the collection. The request body should contain the album details.

```APIDOC
## POST /albums

### Description
Adds a new album to the collection. The request body should contain the album details.

### Method
POST

### Endpoint
/albums

### Parameters
#### Request Body
- **id** (string) - Required - The unique identifier for the album.
- **title** (string) - Required - The title of the album.
- **artist** (string) - Required - The artist of the album.
- **price** (number) - Required - The price of the album.

### Request Example
```json
{
    "id": "4",
    "title": "The Modern Sound of Betty Carter",
    "artist": "Betty Carter",
    "price": 49.99
}
```

### Response
#### Success Response (201)
- **id** (string) - The unique identifier for the album.
- **title** (string) - The title of the album.
- **artist** (string) - The artist of the album.
- **price** (number) - The price of the album.

#### Response Example
```json
{
    "id": "4",
    "title": "The Modern Sound of Betty Carter",
    "artist": "Betty Carter",
    "price": 49.99
}
```
```

--------------------------------

### Reading into a Go Slice Buffer

Source: https://go.dev/doc/effective_go

Demonstrates how to read data into a specific portion of a byte slice buffer using the `Read` method. This is useful for limiting the amount of data read into a predefined buffer.

```go
func (f *File) Read(buf []byte) (n int, err error)
```

```go
n, err := f.Read(buf[0:32])
```

--------------------------------

### Handle Multiple Result Sets with Go's database/sql

Source: https://go.dev/doc/database/querying

This Go code snippet demonstrates how to execute a query that returns multiple result sets and how to iterate through each of them. It utilizes `db.Query` to send multiple SQL statements and `rows.NextResultSet` to advance between the result sets. Ensure proper error handling and closing of rows.

```go
rows, err := db.Query("SELECT * from album; SELECT * from song;")
if err != nil {
    log.Fatal(err)
}
defer rows.Close()

// Loop through the first result set.
for rows.Next() {
    // Handle result set.
}

// Advance to next result set.
rows.NextResultSet()

// Loop through the second result set.
for rows.Next() {
    // Handle second set.
}

// Check for any error in either result set.
if err := rows.Err(); err != nil {
    log.Fatal(err)
}

```

--------------------------------

### Simulate Pig Tournament with 'roundRobin' in Go

Source: https://go.dev/doc/codewalk/functions

Simulates a round-robin tournament where each strategy plays every other strategy a specified number of times. Tallies wins to determine the effectiveness of different strategies.

```go
func roundRobin(strategies []strategy, gamesPerSeries int) [][numStrategies]int {
	var rankings [numStrategies][numStrategies]int
	for i, s1 := range strategies {
		for j, s2 := range strategies {
			if i == j {
				continue
			}
			var s1Score, s2Score score
			for k := 0; k < gamesPerSeries; k++ {
				s1Score, s2Score = play(s1, s2)
				if s1Score.total >= 100 {
					rankings[i][j]++
				}
			}
		}
	}
	return rankings
}

```

--------------------------------

### Define Page Struct in Go

Source: https://go.dev/doc/articles/wiki

Defines the `Page` struct to represent a wiki page with a `Title` (string) and `Body` ([]byte). The `Body` is a byte slice to align with `io` library expectations for file operations.

```go
type Page struct {
    Title string
    Body  []byte
}

```

--------------------------------

### Go Defer for Printing Footer

Source: https://go.dev/doc/articles/defer_panic_recover

Illustrates using defer to print a footer after a function completes its main execution. This is useful for consistent output formatting or cleanup actions.

```go
printHeader()
deffer printFooter()

```

--------------------------------

### Strings Package Split Function (Go)

Source: https://go.dev/doc/devel/weekly

Illustrates the change in the strings package where the original `Split` function has been split into `Split` and `SplitN`. `SplitN` retains the old functionality, while the new `Split` is equivalent to `SplitN` with a -1 argument.

```Go
// Old behavior (prior to Go 1.7):
// strings.Split(s, sep)

// New behavior (Go 1.7 and later):
// strings.SplitN(s, sep, n) // equivalent to old Split
// strings.Split(s, sep) // new behavior, splits into all possible substrings
```

--------------------------------

### Main Function Orchestrating Goroutines and Channels

Source: https://go.dev/doc/codewalk/sharemem

The 'main' function initializes Poller and StateMonitor goroutines, manages 'pending' and 'complete' channels for resource management, and handles the main event loop for processing completed resources.

```go
func main() {
	status := make(chan State)
	pending := make(chan *Resource)
	complete := make(chan *Resource)
	
	go StateMonitor(status)

	for i := 0; i < numPollers; i++ {
		go Poller(pending, complete)
	}

	go func() {
		for _, url := range urls {
			pending <- &Resource{URL: url}
		}
	}()

	for r := range complete {
		go r.Sleep(time.Second) // Simulate work or delay
	}
}
```

--------------------------------

### Go Function with Named Result Parameters for Parsing Integer

Source: https://go.dev/doc/effective_go

A version of the `nextInt` function that uses named result parameters ('value' and 'nextPos') for enhanced clarity. This makes the return values self-documenting.

```go
func nextInt(b []byte, pos int) (value, nextPos int) {
    // Implementation using named results
}
```

--------------------------------

### Go Byte Slice Comparison Using 'switch'

Source: https://go.dev/doc/effective_go

Provides a 'Compare' function that lexicographically compares two byte slices using nested 'switch' statements to determine their order. It handles cases where slices have different lengths.

```go
// Compare returns an integer comparing the two byte slices,
// lexicographically.
// The result will be 0 if a == b, -1 if a < b, and +1 if a > b
func Compare(a, b []byte) int {
    for i := 0; i < len(a) && i < len(b); i++ {
        switch {
        case a[i] > b[i]:
            return 1
        case a[i] < b[i]:
            return -1
        }
    }
    switch {
    case len(a) > len(b):
        return 1
    case len(a) < len(b):
        return -1
    }
    return 0
}
```

--------------------------------

### Get/Update a Specific Go Dependency Version

Source: https://go.dev/doc/go_faq

This command is used to add, upgrade, or downgrade a specific dependency in a Go project managed by modules. It fetches the specified version of the package and updates the `go.mod` and `go.sum` files accordingly.

```go
go get golang.org/x/text@v0.3.5
```

--------------------------------

### Go: Passing Arrays by Pointer

Source: https://go.dev/doc/effective_go

Demonstrates how to pass a Go array by pointer to a function to avoid copying the entire array. This mimics C-like behavior for efficiency but is less idiomatic than using slices.

```go
func Sum(a *[3]float64) (sum float64) {
    for _, v := range *a {
        sum += v
    }
    return
}

array := [...]float64{7.0, 8.5, 9.1}
x := Sum(&array)  // Note the explicit address-of operator

```

--------------------------------

### Go: Save and Load Page Data

Source: https://go.dev/doc/articles/wiki/part1_m=text

This Go code defines a Page struct with Title and Body fields. It includes methods to save the page to a file and load it back. This functionality is useful for simple data persistence.

```go
// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build ignore

package main

import (
	"fmt"
	"os"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func main() {
	p1 := &Page{Title: "TestPage", Body: []byte("This is a sample Page.")}
	p1.save()
	p2, _ := loadPage("TestPage")
	fmt.Println(string(p2.Body))
}

```

--------------------------------

### Go syscall Package Linux and Windows Additions

Source: https://go.dev/doc/devel/weekly

This code snippet highlights additions to the Go syscall package for both Linux and Windows operating systems. For Linux, it includes sockaddr_ll support for specific architectures and the ucred structure for UNIX sockets. For Windows, it implements WaitStatus and Wait4() functionality. These additions expand the capabilities for system-level interactions in cross-platform Go development.

```go
syscall: add sockaddr_ll support for linux/386, linux/amd64 (thanks Mikio Hara),
add ucred structure for SCM_CREDENTIALS over UNIX sockets. (thanks Albert Strasheim).
syscall: implement WaitStatus and Wait4() for windows (thanks Wei Guangjing).
```

--------------------------------

### Print Text to Standard Output in Go

Source: https://go.dev/doc/codewalk/markov

This Go snippet demonstrates how to print a string variable to the standard output. It utilizes the fmt package, a common dependency for I/O operations in Go. The function takes a string as input and produces text output.

```go
package main

import "fmt"

func main() {
	text := "Hello, Go!"
	fmt.Println(text) // Write text to standard output.
}
```

--------------------------------

### Go viewHandler with Error Handling and Redirect

Source: https://go.dev/doc/articles/wiki

This version of 'viewHandler' includes error handling for 'loadPage'. If a page does not exist, it redirects the user to the corresponding edit page.

```go
func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, err := loadPage(title)
    if err != nil {
        http.Redirect(w, r, "/edit/"+title, http.StatusFound)
        return
    }
    renderTemplate(w, "view", p)
}
```

--------------------------------

### Go Slice Initialization Equivalence

Source: https://go.dev/doc/go_spec

Demonstrates the equivalence between using `make` to create a slice and allocating an array and then slicing it in Go. Both methods result in a slice referring to a hidden array.

```Go
make([]int, 50, 100)
new([100]int)[0:50]

```

--------------------------------

### Network Interface Constants for Linux

Source: https://go.dev/doc/devel/weekly

Network interface constants for linux/386 and linux/amd64 have been added to the syscall package. This provides necessary definitions for system calls related to network interfaces on these platforms.

```Go
import "syscall"

// ... syscall.AF_INET, syscall.SOCK_STREAM ...
```

--------------------------------

### Iterative Byte Reading with Go Slices

Source: https://go.dev/doc/effective_go

An alternative method to read data byte by byte into a buffer using a loop and slicing. This approach allows for more granular control over the reading process but is generally less efficient than a single `Read` call.

```go
var n int
var err error
for i := 0; i < 32; i++ {
    nbytes, e := f.Read(buf[i:i+1])  // Read one byte.
    n += nbytes
    if nbytes == 0 || e != nil {
        err = e
        break
    }
}
```

--------------------------------

### Go Markov Chain Data Structures and Methods

Source: https://go.dev/doc/codewalk/markov

Defines the `Prefix` and `Chain` types, along with methods for manipulating prefixes and building/generating text. The `Prefix` type represents a sequence of words, and the `Chain` type stores the Markov model. Dependencies include standard Go libraries like `strings` and `io`.

```go
package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"math/rand"
	"os"
	"strings"
	"time"
)

// Prefix is a Markov chain prefix of one or more words.
type Prefix []string

// String returns the Prefix as a string (for use as a map key).
func (p Prefix) String() string {
	return strings.Join(p, " ")
}

// Shift removes the first word from the Prefix and appends the given word.
func (p Prefix) Shift(word string) {
	copy(p, p[1:])
	p[len(p)-1] = word
}

// Chain contains a map ("chain") of prefixes to a list of suffixes.
// A prefix is a string of prefixLen words joined with spaces.
// A suffix is a single word. A prefix can have multiple suffixes.
type Chain struct {
	chain     map[string][]string
	prefixLen int
}

// NewChain returns a new Chain with prefixes of prefixLen words.
func NewChain(prefixLen int) *Chain {
	return &Chain{make(map[string][]string), prefixLen}
}

// Build reads text from the provided Reader and
// parses it into prefixes and suffixes that are stored in Chain.
func (c *Chain) Build(r io.Reader) {
	br := bufio.NewReader(r)
	p := make(Prefix, c.prefixLen)
	for {
		var s string
		if _, err := fmt.Fscan(br, &s); err != nil {
			break
		}
		key := p.String()
		c.chain[key] = append(c.chain[key], s)
		p.Shift(s)
	}
}

// Generate returns a string of at most n words generated from Chain.
func (c *Chain) Generate(n int) string {
	p := make(Prefix, c.prefixLen)
	var words []string
	for i := 0; i < n; i++ {
		choices := c.chain[p.String()]
		if len(choices) == 0 {
			break
		}
		next := choices[rand.Intn(len(choices))]
		words = append(words, next)
		p.Shift(next)
	}
	return strings.Join(words, " ")
}
```

--------------------------------

### Create Channels for Resource Communication

Source: https://go.dev/doc/codewalk/sharemem

Initializes two channels, 'pending' and 'complete', both of type '*Resource'. These channels facilitate the communication of resources between the main goroutine and Poller goroutines.

```go
pending := make(chan *Resource)
complete := make(chan *Resource)
```

--------------------------------

### Go Package-Level Initialization Dependencies

Source: https://go.dev/doc/go_spec

Demonstrates how initialization dependencies at the package level override the default left-to-right evaluation for individual initialization expressions. It shows function calls and their evaluation order based on these dependencies.

```Go
var a, b, c = f() + v(), g(), sqr(u()) + v()

func f() int        { return c }
func g() int        { return a }
func sqr(x int) int { return x*x }

// functions u and v are independent of all other variables and functions
// Function calls happen in the order u(), sqr(), v(), f(), v(), and g().
```

--------------------------------

### Build Go Binary without Dwarf Compression

Source: https://go.dev/doc/gdb

Command to build a Go executable with uncompressed debug information. This is useful for older GDB versions or systems where debug information compression is not supported, such as older macOS versions.

```bash
go build -ldflags=-compressdwarf=false
```

--------------------------------

### Go Counter Server Implementation (Struct)

Source: https://go.dev/doc/effective_go

A simple counter server implementation using a struct in Go. It increments a counter on each request and displays the count. Access to the counter needs protection in concurrent environments.

```go
// Simple counter server.
type Counter struct {
    n int
}

func (ctr *Counter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ctr.n++
    fmt.Fprintf(w, "counter = %d\n", ctr.n)
}
```

--------------------------------

### Declare a Go Package

Source: https://go.dev/doc/modules/layout

Defines a Go package in its root directory. The package name must match the last path component of the module name. This is a fundamental step for creating reusable Go code.

```go
package modname

// ... package code here
```

--------------------------------

### GDB Info Frame Command

Source: https://go.dev/doc/gdb

The 'info frame' command provides detailed information about the current stack frame, including the program counter (rip), source file and line number, and arguments. This helps in understanding the context of the current execution point.

```gdb
(gdb) info frame
Stack level 0, frame at 0x7ffff7f9ff88:
 rip = 0x425530 in regexp.TestFind (/home/user/go/src/regexp/find_test.go:148);
    saved rip 0x430233
 called by frame at 0x7ffff7f9ffa8
 source language minimal.
 Arglist at 0x7ffff7f9ff78, args: t=0xf840688b60
 Locals at 0x7ffff7f9ff78, Previous frame's sp is 0x7ffff7f9ff88
 Saved registers:
  rip at 0x7ffff7f9ff80
```

--------------------------------

### Concurrency and Networking Enhancements in Go

Source: https://go.dev/doc/devel/weekly

Covers updates related to concurrency and networking in the Go standard library. This includes parallel test execution support in the testing package and new shutdown methods for TCP connections in the net package.

```Go
// net package
// TCPConn.CloseWrite and CloseRead added for shutdown.

// testing package
// Support for running tests in parallel.
```

--------------------------------

### Go - Rewrite Program with Slice Syntax

Source: https://go.dev/doc/devel/weekly

Illustrates the use of `gofmt` to convert old slice syntax `x[lo:len(x)]` to the new shorthand `x[lo:]`. This change simplifies slice operations in Go programs.

```bash
gofmt -w -r 'a[b:len(a)] -> a[b:]' *.go
```

--------------------------------

### Prevent SQL Injection using sql package parameters (Go)

Source: https://go.dev/doc/database/sql-injection

This Go code snippet demonstrates the secure way to pass parameters to SQL queries using the `sql` package. It utilizes placeholders (e.g., `?` or `$1`) which separates the SQL command from the data, preventing malicious input from altering the query's logic. This method is essential for protecting against SQL injection attacks.

```go
// Correct format for executing an SQL statement with parameters.
rows, err := db.Query("SELECT * FROM user WHERE id = ?", id)

```

--------------------------------

### Synchronize Goroutines with Channels

Source: https://go.dev/doc/effective_go

Illustrates how to use an unbuffered channel to synchronize two goroutines. The sender blocks until the receiver has received the value, ensuring a known state for both.

```go
c := make(chan int)  // Allocate a channel.
// Start the sort in a goroutine; when it completes, signal on the channel.
go func() {
    list.Sort()
    c <- 1  // Send a signal; value does not matter.
}()
doSomethingForAWhile()
<-c   // Wait for sort to finish; discard sent value.
```

--------------------------------

### Add Album to Database in Go

Source: https://go.dev/doc/tutorial/database-access

Inserts a new album record into the database and returns the ID of the newly created entry. This function uses `DB.Exec` for non-query SQL statements and `Result.LastInsertId` to retrieve the auto-generated ID. Error handling is included for both the execution and ID retrieval steps.

```go
// addAlbum adds the specified album to the database,
// returning the album ID of the new entry
func addAlbum(alb Album) (int64, error) {
    result, err := db.Exec("INSERT INTO album (title, artist, price) VALUES (?, ?, ?)", alb.Title, alb.Artist, alb.Price)
    if err != nil {
        return 0, fmt.Errorf("addAlbum: %v", err)
    }
    id, err := result.LastInsertId()
    if err != nil {
        return 0, fmt.Errorf("addAlbum: %v", err)
    }
    return id, nil
}

albID, err := addAlbum(Album{
    Title:  "The Modern Sound of Betty Carter",
    Artist: "Betty Carter",
    Price:  49.99,
})
if err != nil {
    log.Fatal(err)
}
fmt.Printf("ID of added album: %v\n", albID)
```

--------------------------------

### Load Go Runtime Support Script Manually in GDB

Source: https://go.dev/doc/gdb

GDB command to manually load the Go runtime support script. This is an alternative to using the '-d' flag during GDB launch, useful if GDB cannot automatically find the script.

```gdb
source ~/go/src/runtime/runtime-gdb.py
```

--------------------------------

### Go Block Syntax

Source: https://go.dev/doc/go_spec

Defines the basic syntax for a block in Go, consisting of an opening brace, a list of statements, and a closing brace. This structure is fundamental for grouping code.

```Go
Block         = "{\"" StatementList "}\"" .
StatementList = { Statement ";" } .

```

--------------------------------

### MkdirAll Works with Symlinks

Source: https://go.dev/doc/devel/weekly

The os.MkdirAll function has been fixed to work correctly even when dealing with symbolic links in the path, thanks to contributions from Ryan Hitchman.

```Go
import "os"

// ... os.MkdirAll("/path/to/symlink/dir", 0755) ...
```

--------------------------------

### Go Package Comment for Gofmt Command

Source: https://go.dev/doc/comment

This Go code snippet shows a package comment for the `gofmt` command. It describes the program's behavior, usage, and flags. The comment uses semantic linefeeds for readability and includes indented sections for preformatted text.

```go
/*
Gofmt formats Go programs.
It uses tabs for indentation and blanks for alignment.
Alignment assumes that an editor is using a fixed-width font.

Without an explicit path, it processes the standard input. Given a file,
it operates on that file; given a directory, it operates on all .go files in
that directory, recursively. (Files starting with a period are ignored.)
By default, gofmt prints the reformatted sources to standard output.

Usage:

    gofmt [flags] [path ...]

The flags are:

    -d
        Do not print reformatted sources to standard output.
        If a file's formatting is different than gofmt's, print diffs
        to standard output.
    -w
        Do not print reformatted sources to standard output.
        If a file's formatting is different from gofmt's, overwrite it
        with gofmt's version. If an error occurred during overwriting,
the original file is restored from an automatic backup.

When gofmt reads from standard input, it accepts either a full Go program
or a program fragment. A program fragment must be a syntactically
valid declaration list, statement list, or expression. When formatting
such a fragment, gofmt preserves leading indentation as well as leading
and trailing spaces, so that individual sections of a Go program can be
formatted by piping them through gofmt.
*/
package main
```

--------------------------------

### Go Slice Conversion: int to interface{}

Source: https://go.dev/doc/go_faq

Illustrates the necessary steps to convert a slice of a concrete type (e.g., `[]int`) to a slice of empty interfaces (`[]interface{}`). Direct conversion is disallowed due to differing memory representations, requiring manual element copying.

```go
t := []int{1, 2, 3, 4}
s := make([]interface{}, len(t))
for i, v := range t {
    s[i] = v
}

```

--------------------------------

### Go - Rewrite Program with `copy` function

Source: https://go.dev/doc/devel/weekly

Demonstrates how to use the `gofmt` tool to automatically rewrite programs that use the deprecated `bytes.Copy` function to the new built-in `copy` function. This ensures compatibility with the updated Go language specification.

```bash
gofmt -w -r 'bytes.Copy(d, s) -> copy(d, s)' *.go
```

--------------------------------

### Go Pointer Declaration and Dereferencing

Source: https://go.dev/doc/articles/gos_declaration_syntax

Explains Go's pointer syntax, which uses the asterisk (*) prefix for both type declarations and dereferencing expressions, similar to C.

```Go
var p *int
x = *p
```

--------------------------------

### Switch to exp/regexp in godoc and suffixarray Go

Source: https://go.dev/doc/devel/weekly

The godoc and suffixarray packages have been updated to use the exp/regexp package. This likely leverages the newer, more performant regular expression implementation.

```Go
package main

import (
	"fmt"
	"regexp"
)

func main() {
	// These packages now use the 'regexp' package (which might have been exp/regexp)
	// for their regular expression needs. This example demonstrates using 'regexp'.

	text := "This is a sample text for testing."
	pattern := regexp.MustCompile(`\w+`)

	matches := pattern.FindAllString(text, -1)
	fmt.Printf("Matches found: %v\n", matches)

	fmt.Println("godoc and suffixarray now use the exp/regexp package.")
}
```

--------------------------------

### Go Struct Embedding for Method Promotion: Job with log.Logger

Source: https://go.dev/doc/effective_go

Shows how to embed a *log.Logger into a Job struct. This embeds the methods of *log.Logger (like Println, Printf) directly into the Job type, simplifying logging operations. It requires the 'log' package.

```go
type Job struct {
    Command string
    *log.Logger
}
```

--------------------------------

### Go Panic and Recover Functions

Source: https://go.dev/doc/devel/weekly

Introduces the `panic` and `recover` functions in Go, designed for error reporting and recovery. The `panicln` function has been removed, and `panic` now accepts a single argument. This code shows the basic usage pattern.

```Go
// Example of panic and recover (conceptual, actual implementation would vary)
// defer func() {
// 	if r := recover(); r != nil {
// 		fmt.Println("Recovered from panic:", r)
// 	}
// }()
// panic("something went wrong")
```

--------------------------------

### Go Function with Named Results for Reading Full Buffer

Source: https://go.dev/doc/effective_go

An implementation of `io.ReadFull` using named result parameters ('n' for count and 'err' for error). This leverages the idiomatic Go pattern where an unadorned `return` statement returns the current values of the named results.

```go
func ReadFull(r Reader, buf []byte) (n int, err error) {
    for len(buf) > 0 && err == nil {
        var nr int
        nr, err = r.Read(buf)
        n += nr
        buf = buf[nr:]
    }
    return
}
```

--------------------------------

### Go Method Declaration Syntax

Source: https://go.dev/doc/go_spec

Defines the basic syntax for a Go method declaration, including the receiver, method name, signature, and optional function body.

```go
MethodDecl = "func" Receiver MethodName Signature [ FunctionBody ] .
```

```go
Receiver   = Parameters .
```

--------------------------------

### FileSet.File and Iterator in token/position

Source: https://go.dev/doc/devel/weekly

The token/position package has gained new functionality with the addition of FileSet.File and a files iterator. These provide better ways to access and iterate over files within a FileSet.

```Go
import "go/token"

// ... fset := token.NewFileSet()
// ... file := fset.File(position)
// ... for _, f := range fset.Iter() { ... }
```

--------------------------------

### Go Channel-Based Notification Server

Source: https://go.dev/doc/effective_go

An HTTP handler in Go that uses a channel to send a notification on each visit. The channel receives the request object. It's recommended to use a buffered channel.

```go
// A channel that sends a notification on each visit.
// (Probably want the channel to be buffered.)
type Chan chan *http.Request

func (ch Chan) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ch <- req
    fmt.Fprint(w, "notification sent")
}
```

--------------------------------

### Make zero FlagSet useful in flag Go

Source: https://go.dev/doc/devel/weekly

The flag package's zero FlagSet has been made more useful. This likely means that creating a FlagSet without any explicit initialization now provides sensible defaults or basic functionality.

```Go
package main

import (
	"flag"
	"fmt"
)

func main() {
	// Previously, a zero FlagSet might have been unusable or required significant setup.
	// Now, it can potentially be used directly or with minimal additions.

	var fs flag.FlagSet

	// Example: Defining a flag on the zero FlagSet
	var name string
	fs.StringVar(&name, "name", "World", "Your name")

	// To parse flags, you would typically pass os.Args[1:] or a custom slice.
	// For demonstration, we'll simulate parsing an empty list, which should not error.
	err := fs.Parse([]string{})
	if err != nil {
		fmt.Printf("Error parsing flags: %v\n", err)
	}

	fmt.Printf("Hello, %s!\n", name)

	fmt.Println("Zero FlagSet is now more useful.")
}
```

--------------------------------

### Define Album Struct in Go

Source: https://go.dev/doc/tutorial/database-access

Defines a Go struct named 'Album' to represent a row of data from a database table. This struct includes fields for ID, Title, Artist, and Price, corresponding to database columns.

```go
type Album struct {
    ID     int64
    Title  string
    Artist string
    Price  float32
}

```

--------------------------------

### Call Generic Function with Constraint and Inferred Types (Go)

Source: https://go.dev/doc/tutorial/generics

Shows how to call the `SumNumbers` generic function without specifying type arguments. The compiler infers the types for the map keys and values from the provided map arguments (`ints` and `floats`), demonstrating simplified usage with constraints.

```Go
fmt.Printf("Generic Sums with Constraint: %v and %v\n",
    SumNumbers(ints),
    SumNumbers(floats))

```

--------------------------------

### Go Control Structure - If Statement

Source: https://go.dev/doc/effective_go

Illustrates the basic syntax of an if statement in Go, emphasizing the mandatory brace delimiters for the code block. It also shows the idiomatic omission of the 'else' keyword when the 'if' block ends with a control flow statement like 'return'.

```Go
if x > 0 {
    return y
}
```

```Go
if err := file.Chmod(0664); err != nil {
    log.Print(err)
    return err
}
```

```Go
f, err := os.Open(name)
if err != nil {
    return err
}
codeUsing(f)
```

```Go
f, err := os.Open(name)
if err != nil {
    return err
}
d, err := f.Stat()
if err != nil {
    f.Close()
    return err
}
codeUsing(f, d)
```

--------------------------------

### Merge Go Coverage Data from Multiple Directories

Source: https://go.dev/doc/build-cover

This command merges coverage profiles from multiple data directories into a single corpus. The `go tool covdata merge` command uses the `-i` flag to specify input directories and the `-o` flag to designate the output directory for the merged data. This is useful for creating cross-platform coverage summaries.

```shell
$ mkdir merged
$ go tool covdata merge -i=windows_datadir,macos_datadir -o merged
$ 

```

--------------------------------

### Go Defer Statement Syntax

Source: https://go.dev/doc/go_spec

Illustrates the basic syntax for a defer statement in Go. The expression following 'defer' must be a function or method call.

```go
DeferStmt = "defer" Expression .
```

--------------------------------

### Go Short Variable Declarations

Source: https://go.dev/doc/go_spec

Illustrates short variable declarations using the ':=' syntax. This is a concise way to declare and initialize variables within functions, allowing for redeclaration under specific conditions.

```go
i, j := 0, 10
f := func() int { return 7 }
ch := make(chan int)
r, w, _ := os.Pipe()  // os.Pipe() returns a connected pair of Files and an error, if any
_, y, _ := coord(p)   // coord() returns three values; only interested in y coordinate
```

```go
field1, offset := nextField(str, 0)
field2, offset := nextField(str, offset)  // redeclares offset
x, y, x := 1, 2, 3                        // illegal: x repeated on left side of :=
```

--------------------------------

### Declare and Initialize a Go Array

Source: https://go.dev/doc/articles/slices_usage_and_internals

Demonstrates the declaration of a Go array with a fixed size and element type, and how to assign values to its elements. It also shows how to retrieve an element by its index. The zero value of an array is a ready-to-use array with zeroed elements.

```go
var a [4]int
a[0] = 1
i := a[0]
// i == 1

// a[2] == 0, the zero value of the int type
```

--------------------------------

### Added regression test tool for Unicode test set in exp/norm Go

Source: https://go.dev/doc/devel/weekly

The exp/norm package now includes a regression test tool designed for the standard Unicode test set. This enhances the reliability and correctness of Unicode normalization implementations.

```Go
package main

import "fmt"

func main() {
	// This snippet demonstrates the concept. The actual regression test tool
	// would be used in a separate test file or as a command-line utility
	// to verify Unicode normalization correctness against a known test set.
	fmt.Println("exp/norm package now includes a regression test tool for Unicode.")
	fmt.Println("This tool helps ensure correct Unicode normalization.")
}
```

--------------------------------

### Go Type Switch for Interface Variable Inspection

Source: https://go.dev/doc/effective_go

Demonstrates how to use a type switch to determine the dynamic type of an interface variable. It handles different types, including booleans, integers, and pointers to them. If an unexpected type is encountered, it prints a message.

```go
var t interface{}
t = functionOfSomeType()
switch t := t.(type) {
default:
    fmt.Printf("unexpected type %T\n", t)     // %T prints whatever type t has
case bool:
    fmt.Printf("boolean %t\n", t)             // t has type bool
case int:
    fmt.Printf("integer %d\n", t)             // t has type int
case *bool:
    fmt.Printf("pointer to boolean %t\n", *t) // t has type *bool
case *int:
    fmt.Printf("pointer to integer %d\n", *t) // t has type *int
}
```

--------------------------------

### Convert Old Go Syntax to New with gofmt

Source: https://go.dev/doc/devel/weekly

This command-line utility converts Go programs written with the older syntax to the new, lighter syntax by implying semicolons between statement-ending tokens and newlines. It requires no external dependencies and operates directly on Go source files.

```shell
gofmt -oldparser -w *.go
```

--------------------------------

### GDB Basic Operations for Go

Source: https://go.dev/doc/gdb

These GDB commands are useful for basic debugging tasks in Go programs, such as listing source code, setting breakpoints, disassembling code, inspecting the call stack, and examining local variables and arguments. They are standard GDB commands applicable to Go binaries compiled with DWARF debugging information.

```gdb
(gdb) list
(gdb) list _line_
(gdb) list _file.go_:_line_
(gdb) break _line_
(gdb) break _file.go_:_line_
(gdb) disas
(gdb) bt
(gdb) frame _n_
(gdb) info locals
(gdb) info args
(gdb) p variable
(gdb) whatis variable
```

--------------------------------

### Go 'switch' with Labeled 'break' for Outer Loops

Source: https://go.dev/doc/effective_go

Shows how to use a labeled 'break' statement to exit not just the 'switch' but also a surrounding loop, useful in complex nested control flow scenarios.

```go
Loop:
    for n := 0; n < len(src); n += size {
        switch {
        case src[n] < sizeOne:
            if validateOnly {
                break
            }
            size = 1
            update(src[n])

        case src[n] < sizeTwo:
            if n+1 >= len(src) {
                err = errShortInput
                break Loop
            }
            if validateOnly {
                break
            }
            size = 2
            update(src[n] + src[n+1]<<shift)
        }
    }
```

--------------------------------

### Check Map Key Presence in Go Using Blank Identifier

Source: https://go.dev/doc/effective_go

Shows how to check for the presence of a key in a Go map without retrieving its value, using the blank identifier (`_`). This is useful when only existence matters.

```go

_, present := timeZone[tz]

```

--------------------------------

### GDB List Command (l)

Source: https://go.dev/doc/gdb

The 'l' command lists the source code around the current execution point. This helps in orienting yourself within the codebase and understanding the immediate context of the code being debugged.

```gdb
(gdb) l
92              mu      sync.Mutex
93              machine []*machine
94      }
95 
96      // String returns the source text used to compile the regular expression.
97      func (re *Regexp) String() string {
98              return re.expr
99      }
100 
101     // Compile parses a regular expression and returns, if successful,
```

--------------------------------

### Go Generic Method Receiver Syntax

Source: https://go.dev/doc/go_faq

Demonstrates the syntax for defining a method on a generic struct in Go. It highlights a common pitfall where attempting to use a predeclared type like 'string' as a type argument in the receiver can lead to compiler errors due to name shadowing.

```go
type S[T any] struct {
    f T
}

func (s S[string]) Add(t string) string {
    return s.f + t
}

```

--------------------------------

### Go Variable Declaration Syntax

Source: https://go.dev/doc/articles/gos_declaration_syntax

Illustrates Go's variable declaration syntax, which places the variable name first, followed by its type. This differs from some other languages and C's approach.

```Go
x int
p *int
a [3]int
```

--------------------------------

### Go Utility Function: `ratioString` for Displaying Results

Source: https://go.dev/doc/codewalk/pig

A helper function to format results as a human-readable string. It takes a variable number of integers, calculates their sum, and then returns a comma-separated string showing each value as a fraction of the total and its corresponding percentage, formatted to one decimal place.

```go
package main

import (
	"fmt"
)

// ratioString takes a list of integer values and returns a string that lists
// each value and its percentage of the sum of all values.
// e.g., ratios(1, 2, 3) = "1/6 (16.7%), 2/6 (33.3%), 3/6 (50.0%)"
func ratioString(vals ...int) string {
	total := 0
	for _, val := range vals {
		total += val
	}
	s := ""
	for _, val := range vals {
		if s != "" {
			s += ", "
		}
		pct := 100 * float64(val) / float64(total)
		s += fmt.Sprintf("%d/%d (%0.1f%%)", val, total, pct)
	}
	return s
}
```

--------------------------------

### Opening a MySQL Database Handle with Connection String

Source: https://go.dev/doc/database/open-handle

This Go code snippet illustrates how to open a database handle for MySQL using `sql.Open` with a formatted connection string. It includes error handling for the connection attempt. The connection string format is specific to the MySQL driver and typically includes username, password, network type, address, and database name.

```go
db, err = sql.Open("mysql", "username:password@tcp(127.0.0.1:3306)/jazzrecords")
if err != nil {
    log.Fatal(err)
}

```

--------------------------------

### Build Go Package with Escape Analysis Flags

Source: https://go.dev/doc/gc-guide

This command builds a Go package and includes detailed information about the compiler's escape analysis, showing which values are escaped to the heap and why. This is useful for identifying potential memory optimization opportunities.

```bash
go build -gcflags=-m=3 [package]
```

--------------------------------

### Go Main Function Declaration

Source: https://go.dev/doc/go_spec

Defines the entry point for a Go program. The main package must declare a function named `main` that takes no arguments and returns no value.

```go
func main() { ... }

```

--------------------------------

### Counter File Naming Schema

Source: https://go.dev/doc/telemetry

Defines the schema for naming counter files, which includes program details, Go version, OS, architecture, and date. This structured naming helps in organizing and identifying telemetry data.

```text
[program name]@[program version]-[go version]-[GOOS]-[GOARCH]-[date].v1.count

```

--------------------------------

### Replace local 'greetings' module dependency

Source: https://go.dev/doc/tutorial/call-module-code

This command modifies the 'go.mod' file of the 'hello' module to use a local version of the 'greetings' module. It sets up a 'replace' directive, pointing to the 'greetings' directory relative to the 'hello' module.

```shell
$ go mod edit -replace example.com/greetings=../greetings
```

--------------------------------

### Go 'for range' Syntax for Arrays, Slices, Strings, Maps, and Channels

Source: https://go.dev/doc/go_spec

This snippet illustrates the basic syntax of the 'for range' clause in Go when used with arrays, slices, strings, maps, and channels. It shows how to capture iteration values like index and element, or key and value.

```Go
for index, value := range collection {
    // code to execute for each element
}

for key, value := range myMap {
    // code to execute for each key-value pair
}

for element := range myChannel {
    // code to process received elements
}
```

--------------------------------

### Go Function Documentation: strconv.Quote

Source: https://go.dev/doc/comment

Documents the `Quote` function in the `strconv` package, explaining its purpose of returning a double-quoted Go string literal with proper escape sequences for control and non-printable characters. It specifies the input as a string and the output as a string.

```Go
package strconv

// Quote returns a double-quoted Go string literal representing s.
// The returned string uses Go escape sequences (\t, \n, \xFF, \u0100)
// for control characters and non-printable characters as defined by IsPrint.
func Quote(s string) string {
    ...
}
```

--------------------------------

### Configure GODEBUG Settings (`godebug` directive)

Source: https://go.dev/doc/modules/gomod-ref

The `godebug` directive sets default GODEBUG configurations for the main packages of a module. These settings override toolchain defaults but can be overridden by `//go:debug` lines within main packages. Values are typically 0 for disable and 1 for enable.

```go
godebug debug-key=debug-value
```

--------------------------------

### Go Variable Declaration: Pointers

Source: https://go.dev/doc/faq

Demonstrates Go's clear and regular way of declaring variables, specifically pointers, contrasting it with C's syntax. This simplifies parsing and tool development.

```go
var a, b *int
```

--------------------------------

### Go http.Handler Interface Definition

Source: https://go.dev/doc/effective_go

Defines the Handler interface in Go's http package. Any type implementing the ServeHTTP method can satisfy this interface and serve HTTP requests.

```go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```

--------------------------------

### Go Single Constant Declaration with Doc Comment

Source: https://go.dev/doc/comment

Shows how to document a single, ungrouped constant with a comprehensive doc comment. This method is preferred when a constant requires a detailed explanation beyond a short inline comment.

```Go
package unicode

// Version is the Unicode edition from which the tables are derived.
const Version = "13.0.0"

```

--------------------------------

### Go ForClause Grammar

Source: https://go.dev/doc/go_spec

Defines the syntax for a ForClause in Go, specifying the optional init statement, condition, and post statement. InitStmt and PostStmt are defined as SimpleStmt.

```go
ForClause = [ InitStmt ] " ; " [ Condition ] " ; " [ PostStmt ] .
InitStmt  = SimpleStmt .
PostStmt  = SimpleStmt .

```

--------------------------------

### Cgo Tool Changes: Removal of Stub .so Files

Source: https://go.dev/doc/devel/weekly

The cgo tool has been updated to no longer rely on stub .so files like cgo_stdio.so. Packages using standard Makefiles should build without modification, but alternative build mechanisms may require updates.

```shell
# Example build command (conceptual)
make build
```

--------------------------------

### Merging Go Profiles with pprof

Source: https://go.dev/doc/pgo

This command merges multiple Go profiles into a single profile using the 'pprof' tool. It's crucial to ensure all input profiles have the same wall duration for accurate merging, especially when profiling short time slices of long-running applications. The merged profile can then be used for PGO.

```shell
$ go tool pprof -proto a.pprof b.pprof > merged.pprof

```

--------------------------------

### Go Function Documentation: os.Exit

Source: https://go.dev/doc/comment

Documents the `Exit` function in the `os` package, explaining that it terminates the current program with a specified status code. It clarifies conventional status codes (0 for success, non-zero for error), notes that deferred functions are not run, and advises on a portable status code range [0, 125].

```Go
package os

// Exit causes the current program to exit with the given status code.
// Conventionally, code zero indicates success, non-zero an error.
// The program terminates immediately; deferred functions are not run.
//
// For portability, the status code should be in the range [0, 125].
func Exit(code int) {
    ...
}
```

--------------------------------

### Go utf8 Package String Indexing

Source: https://go.dev/doc/devel/weekly

Introduces the new 'String' type in the 'utf8' package, providing efficient rune-based indexing into strings. This avoids the previous performance overhead of converting strings to '[]int'.

```go
// Previously required conversion to []int for indexing.
// Now, use utf8.String for efficient rune indexing.
```

--------------------------------

### Go Function Variable Declaration

Source: https://go.dev/doc/articles/gos_declaration_syntax

Shows how to declare function variables (similar to function pointers in C) in Go, illustrating complex type declarations that maintain left-to-right readability.

```Go
f func(func(int,int) int, int) int
f func(func(int,int) int, int) func(int, int) int
```

--------------------------------

### JSON and XML Struct Tag Updates (Go)

Source: https://go.dev/doc/devel/weekly

Demonstrates the required update for struct tags when using the `json` and `xml` packages. Code using the old syntax `name` must be updated to `json:"name"` or `xml:"name"` respectively.

```Go
// Old syntax (pre Go 1.7):
type T struct {
        X int "name"
}

// New syntax (Go 1.7 and later):
type T struct {
        X int `json:"name"`  // or `xml:"name"`
}
```

--------------------------------

### Go Source File Organization Syntax

Source: https://go.dev/doc/go_spec

The grammatical definition for a Go source file, outlining its structure. It includes the package clause, import declarations, and top-level declarations.

```go
SourceFile = PackageClause ";" { ImportDecl ";" } { TopLevelDecl ";" } .
```

--------------------------------

### Tidy Module Dependencies with Go

Source: https://go.dev/doc/modules/publishing

Removes unused dependencies from your Go module. This command ensures that your module's dependency list is clean and only includes necessary packages. It's a crucial step before publishing to maintain module integrity.

```bash
$ go mod tidy

```

--------------------------------

### Go Function Documentation: io.Copy

Source: https://go.dev/doc/comment

Documents the `Copy` function in the `io` package, explaining its process of copying data from `src` to `dst` until EOF is reached or an error occurs. It details the return values: total bytes written and the first error encountered, clarifying that a successful copy returns `err == nil` and that EOF from `Read` is not treated as an error.

```Go
package io

// Copy copies from src to dst until either EOF is reached
// on src or an error occurs. It returns the total number of bytes
// written and the first error encountered while copying, if any.
//
// A successful Copy returns err == nil, not err == EOF.
// Because Copy is defined to read from src until EOF, it does
// not treat an EOF from Read as an error to be reported.
func Copy(dst Writer, src Reader) (n int64, err error) {
    ...
}
```

--------------------------------

### Launch Poller Goroutines for Parallel Processing

Source: https://go.dev/doc/codewalk/sharemem

Launches multiple 'Poller' goroutines to process resources concurrently. Each poller receives necessary channels as arguments for communication.

```go
for i := 0; i < numPollers; i++ {
	go Poller(pending, complete)
}
```

--------------------------------

### Go Type Declarations and Underlying Types

Source: https://go.dev/doc/go_spec

Demonstrates Go's type alias and type definition syntax to illustrate the concept of underlying types. It shows how type aliases inherit the underlying type, while type definitions create distinct types.

```go
type (
	A1 = string
	A2 = A1
)

type (
	B1 string
	B2 B1
	B3 []B1
	B4 B3
)

func f[P any](x P) { … 
}
```

--------------------------------

### ImportedLibraries and ImportedSymbols in debug/elf, debug/macho

Source: https://go.dev/doc/devel/weekly

The debug/elf and debug/macho packages now provide ImportedLibraries and ImportedSymbols functions. These functions allow access to information about imported libraries and symbols within ELF and Mach-O object files.

```Go
import (
    "debug/elf"
    "debug/macho"
)

// ...
elfFile, _ := elf.Open("program")
imports, _ := elfFile.ImportedLibraries()
symbols, _ := elfFile.ImportedSymbols()
// ...
```

--------------------------------

### Go Server Handles Requests from a Channel

Source: https://go.dev/doc/effective_go

Illustrates a Go server-side handler function that continuously processes requests from a queue channel. It executes the function associated with each request and sends the result back via the request's result channel.

```Go
func handle(queue chan *Request) {
    for req := range queue {
        req.resultChan <- req.f(req.args)
    }
}

```

--------------------------------

### HTML Template: Case-Insensitive Doctype Check

Source: https://go.dev/doc/devel/weekly

Demonstrates how the html/template package now performs case-insensitive doctype checks. This improves flexibility when parsing or generating HTML documents.

```go
package main

import (
	"html/template"
	"os"
	"fmt"
	"strings"
)

func main() {
	// Example using a template with a case-insensitive doctype
	templateString := `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html1/loose.dtd">
<html>
<head><title>Test</title></head>
<body>
<h1>Hello, World!</h1>
</body>
</html>
`

	// The html/template package is designed to parse HTML snippets.
	// The check mentioned in the changelog relates to how the package might interpret
	// or validate HTML structures, particularly doctype declarations.
	// A direct demonstration of the 'case-insensitive doctype check' often occurs
	// internally during parsing or validation, not as an explicit function call.

	// We can simulate by showing that a template with a mixed-case doctype is valid.
	// If the check were case-sensitive, variations might cause issues depending on the context.

	ttmpl, err := template.New("test").Parse(templateString)
	if err != nil {
		fmt.Printf("Error parsing template with mixed-case doctype: %v\n", err)
	} else {
		fmt.Println("Template parsed successfully with mixed-case doctype.")
		// Execute the template to ensure it's fully processed
		err = tmpl.Execute(os.Stdout, nil)
		if err != nil {
			fmt.Printf("Error executing template: %v\n", err)
		} else {
			fmt.Println("\nTemplate executed successfully.")
		}
	}

	// Example with an even more explicitly mixed-case doctype to emphasize case-insensitivity
	templateStringMixedCase := `<!doCtYPe HTmL>
<html><body>Just text</body></html>`
	ttmplMixed, errMixed := template.New("test2").Parse(templateStringMixedCase)
	if errMixed != nil {
		fmt.Printf("Error parsing template with highly mixed-case doctype: %v\n", errMixed)
	} else {
		fmt.Println("\nTemplate parsed successfully with highly mixed-case doctype.")
	}
}

```

--------------------------------

### Confirming Database Connection with Ping in Go

Source: https://go.dev/doc/database/open-handle

Shows how to confirm a database connection after opening a handle using sql.Open. The Ping method is called to verify that a connection can be established. This is important when the database connection might not be created immediately upon opening the handle.

```go
db, err = sql.Open("mysql", connString)

// Confirm a successful connection.
if err := db.Ping(); err != nil {
    log.Fatal(err)
}
```

--------------------------------

### Gob Encoding and Registration Fixes

Source: https://go.dev/doc/devel/weekly

The gob package has been improved with documentation regarding byte counts in encoding, a fix for sending zero-length top-level slices and maps, and ensuring Register uses the original type.

```Go
import "encoding/gob"

// ... gob.Register(myType) ...
```

--------------------------------

### Simulate Pig Game Logic in Go

Source: https://go.dev/doc/codewalk/functions

Simulates a single game of Pig by repeatedly calling an 'action' to update the 'score' until a player reaches 100 points. Actions are determined by the current player's 'strategy'.

```go
func play(p1, p2 strategy) (score, score) {
	var s1, s2 score
	for {
		s1 = p1(s1)
		if s1.total >= 100 {
			return s1, s2
		}
		s2 = p2(s2)
		if s2.total >= 100 {
			return s1, s2
		}
	}
}

```

--------------------------------

### Save Page Method in Go

Source: https://go.dev/doc/articles/wiki

Implements a `save` method on the `Page` struct to persist the page's content to a file. It constructs a filename from the page title and uses `os.WriteFile` to write the body. Returns an error if the write operation fails.

```go
func (p *Page) save() error {
    filename := p.Title + ".txt"
    return os.WriteFile(filename, p.Body, 0600)
}

```

--------------------------------

### Go: Initial HTTP Handler with Direct Error Handling

Source: https://go.dev/doc/articles/error_handling

This Go code snippet demonstrates a basic HTTP handler that directly checks and handles errors returned by datastore operations and template execution. It uses http.Error to display errors to the user, which can lead to repetitive code in larger applications.

```go
func init() {
    http.HandleFunc("/view", viewRecord)
}

func viewRecord(w http.ResponseWriter, r *http.Request) {
    c := appengine.NewContext(r)
    key := datastore.NewKey(c, "Record", r.FormValue("id"), 0, nil)
    record := new(Record)
    if err := datastore.Get(c, key, record); err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    if err := viewTemplate.Execute(w, record); err != nil {
        http.Error(w, err.Error(), 500)
    }
}
```

--------------------------------

### Sum Method Argument Change (hash Package)

Source: https://go.dev/doc/devel/weekly

The `Sum` method of the `hash.Hash` interface now accepts a `[]byte` argument. This allows users to append the hash to an existing byte slice. Existing code can pass `nil` as the argument, and `gofix` can automate this update.

```Go
func (h *hash.Hash) Sum(b []byte) []byte

```

--------------------------------

### Query Albums by Artist in Go

Source: https://go.dev/doc/tutorial/database-access

Implements a Go function 'albumsByArtist' that queries a database for albums associated with a given artist name. It handles potential errors during the query execution and row scanning, returning a slice of Album structs or an error.

```go
// albumsByArtist queries for albums that have the specified artist name.
func albumsByArtist(name string) ([]Album, error) {
    // An albums slice to hold data from returned rows.
    var albums []Album

    rows, err := db.Query("SELECT * FROM album WHERE artist = ?", name)
    if err != nil {
        return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
    }
    defer rows.Close()
    // Loop through rows, using Scan to assign column data to struct fields.
    for rows.Next() {
        var alb Album
        if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
            return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
        }
        albums = append(albums, alb)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
    }
    return albums, nil
}

```

--------------------------------

### Grow dwarf includestack on demand in ld Go

Source: https://go.dev/doc/devel/weekly

The linker (ld) component has been updated to grow the DWARF 'includestack' on demand. This optimization helps manage memory usage, especially for programs with complex debugging information.

```Go
package main

import "fmt"

func main() {
	// This change is internal to the Go linker and affects how DWARF debug information is generated.
	// 'includestack' refers to a part of the DWARF data structure.
	// Growing it on demand means it won't allocate excessive memory upfront if not needed.

	fmt.Println("Linker (ld) now grows DWARF includestack on demand.")
	// This typically improves build performance and reduces memory footprint during linking.
}
```

--------------------------------

### Go: Non-Generic Summation Functions

Source: https://go.dev/doc/tutorial/generics

These functions sum values from maps containing either int64 or float64. They require separate implementations for each numeric type, leading to code duplication.

```go
package main

import "fmt"

type Number interface {
    int64 | float64
}

func main() {
    // Initialize a map for the integer values
    ints := map[string]int64{
        "first": 34,
        "second": 12,
    }

    // Initialize a map for the float values
    floats := map[string]float64{
        "first": 35.98,
        "second": 26.99,
    }

    fmt.Printf("Non-Generic Sums: %v and %v\n",
        SumInts(ints),
        SumFloats(floats))

    fmt.Printf("Generic Sums: %v and %v\n",
        SumIntsOrFloats[string, int64](ints),
        SumIntsOrFloats[string, float64](floats))

    fmt.Printf("Generic Sums, type parameters inferred: %v and %v\n",
        SumIntsOrFloats(ints),
        SumIntsOrFloats(floats))

    fmt.Printf("Generic Sums with Constraint: %v and %v\n",
        SumNumbers(ints),
        SumNumbers(floats))
}

// SumInts adds together the values of m.
func SumInts(m map[string]int64) int64 {
    var s int64
    for _, v := range m {
        s += v
    }
    return s
}

// SumFloats adds together the values of m.
func SumFloats(m map[string]float64) float64 {
    var s float64
    for _, v := range m {
        s += v
    }
    return s
}

// SumIntsOrFloats sums the values of map m. It supports both floats and integers
// as map values.
func SumIntsOrFloats[K comparable, V int64 | float64](m map[K]V) V {
    var s V
    for _, v := range m {
        s += v
    }
    return s
}

// SumNumbers sums the values of map m. Its supports both integers
// and floats as map values.
func SumNumbers[K comparable, V Number](m map[K]V) V {
    var s V
    for _, v := range m {
        s += v
    }
    return s
}

```

--------------------------------

### Go crypto/cipher: New package replacing crypto/block

Source: https://go.dev/doc/devel/weekly

Announces the introduction of the `crypto/cipher` package, which supersedes the older `crypto/block` package. This change likely involves API updates and potentially new features or a more organized structure for cryptographic primitives.

```Go
crypto/cipher: new package to replace crypto/block (thanks Adam Langley).
```

--------------------------------

### Go CubeRoot Function with Panic for Non-Convergence

Source: https://go.dev/doc/effective_go

This Go code snippet demonstrates a toy implementation of the cube root function using Newton's method. It includes a 'panic' call if the function fails to converge after a million iterations, indicating an unrecoverable state for this specific calculation. The 'veryClose' function (not shown) is assumed to exist for checking convergence.

```Go
// A toy implementation of cube root using Newton's method.
func CubeRoot(x float64) float64 {
    z := x/3   // Arbitrary initial value
    for i := 0; i < 1e6; i++ {
        prevz := z
        z -= (z*z*z-x) / (3*z*z)
        if veryClose(z, prevz) {
            return z
        }
    }
    // A million iterations has not converged; something is wrong.
    panic(fmt.Sprintf("CubeRoot(%g) did not converge", x))
}

```

--------------------------------

### Go Module Declaration

Source: https://go.dev/doc/modules/layout

Specifies the module path for a Go project. This line in the go.mod file uniquely identifies the module and is used for dependency management and imports. It should reflect the repository path.

```go
module github.com/someuser/modname
```

--------------------------------

### Go Sequential Constant Declaration with Iota

Source: https://go.dev/doc/go_spec

Demonstrates using the 'iota' identifier for declaring sequential integer constants within a grouped 'const' block.

```Go
const (
	Sunday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Partyday
	numberOfDays  // this constant is not exported
)

```

--------------------------------

### Go fmt package: Enhanced Scan for Inf/NaN and formatting

Source: https://go.dev/doc/devel/weekly

This snippet describes improvements to the `fmt.Scan` function in Go, enabling it to parse 'Inf' and 'NaN' values. Additionally, it introduces support for the '% X' format specifier, alongside the existing '% x', for hexadecimal output.

```Go
fmt: Scan accepts Inf and NaN,
        allow "% X" as well as "% x".
```

--------------------------------

### Pig Game Core Logic in Go

Source: https://go.dev/doc/codewalk/pig_m=text

Implements the core game logic for Pig, including score tracking, dice rolling, and player turns. It defines types for scores and actions, and functions for simulating a single game.

```Go
// Copyright 2011 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"fmt"
	"math/rand"
)

const (
	win            = 100 // The winning score in a game of Pig
	gamesPerSeries = 10  // The number of games per series to simulate
)

// A score includes scores accumulated in previous turns for each player,
// as well as the points scored by the current player in this turn.
type score struct {
	player, opponent, thisTurn int
}

// An action transitions stochastically to a resulting score.
type action func(current score) (result score, turnIsOver bool)

// roll returns the (result, turnIsOver) outcome of simulating a die roll.
// If the roll value is 1, then thisTurn score is abandoned, and the players' roles swap.
// Otherwise, the roll value is added to thisTurn.
func roll(s score) (score, bool) {
	outcome := rand.Intn(6) + 1 // A random int in [1, 6]
	if outcome == 1 {
		return score{s.opponent, s.player, 0}, true
	}
	return score{s.player, s.opponent, outcome + s.thisTurn}, false
}

// stay returns the (result, turnIsOver) outcome of staying.
// thisTurn score is added to the player's score, and the players' roles swap.
func stay(s score) (score, bool) {
	return score{s.opponent, s.player + s.thisTurn, 0}, true
}

// A strategy chooses an action for any given score.
type strategy func(score) action

// stayAtK returns a strategy that rolls until thisTurn is at least k, then stays.
func stayAtK(k int) strategy {
	return func(s score) action {
		if s.thisTurn >= k {
			return stay
		}
		return roll
	}
}

// play simulates a Pig game and returns the winner (0 or 1).
func play(strategy0, strategy1 strategy) int {
	strategies := []strategy{strategy0, strategy1}
	var s score
	var turnIsOver bool
	currentPlayer := rand.Intn(2) // Randomly decide who plays first
	for s.player+s.thisTurn < win {
		action := strategies[currentPlayer](s)
		s, turnIsOver = action(s)
		if turnIsOver {
			currentPlayer = (currentPlayer + 1) % 2
		}
	}
	return currentPlayer
}

// roundRobin simulates a series of games between every pair of strategies.
func roundRobin(strategies []strategy) ([]int, int) {
	wins := make([]int, len(strategies))
	for i := 0; i < len(strategies); i++ {
		for j := i + 1; j < len(strategies); j++ {
			for k := 0; k < gamesPerSeries; k++ {
				winner := play(strategies[i], strategies[j])
				if winner == 0 {
					wins[i]++
				} else {
					wins[j]++
				}
			}
		}
	}
	gamesPerStrategy := gamesPerSeries * (len(strategies) - 1) // no self play
	return wins, gamesPerStrategy
}

// ratioString takes a list of integer values and returns a string that lists
// each value and its percentage of the sum of all values.
// e.g., ratios(1, 2, 3) = "1/6 (16.7%), 2/6 (33.3%), 3/6 (50.0%)"
func ratioString(vals ...int) string {
	total := 0
	for _, val := range vals {
		total += val
	}
	s := ""
	for _, val := range vals {
		if s != "" {
			s += ", "
		}
		pct := 100 * float64(val) / float64(total)
		s += fmt.Sprintf("%d/%d (%0.1f%%)", val, total, pct)
	}
	return s
}

func main() {
	strategies := make([]strategy, win)
	for k := range strategies {
		strategies[k] = stayAtK(k + 1)
	}
	wins, games := roundRobin(strategies)

	for k := range strategies {
		fmt.Printf("Wins, losses staying at k =% 4d: %s\n",
			k+1,
			ratioString(wins[k], games-wins[k]))
	}
}

```

--------------------------------

### Go: Replace Module with Repository Fork

Source: https://go.dev/doc/modules/managing-dependencies

This snippet shows how to use the 'replace' directive in a go.mod file to direct Go tools to use a forked repository for a dependency. This is beneficial when you need to test changes made in your fork before they are merged into the original module. The 'replace' directive allows you to specify an alternative path and version for the module.

```go.mod
module example.com/mymodule

go 1.23.0

require example.com/theirmodule v1.2.3

replace example.com/theirmodule v1.2.3 => example.com/myfork/theirmodule v1.2.3-fixed

```

```shell
$ go list -m example.com/theirmodule
example.com/theirmodule v1.2.3
$ go mod edit -replace=example.com/theirmodule@v1.2.3=example.com/myfork/theirmodule@v1.2.3-fixed

```

--------------------------------

### Implement Multiple Greetings Function in Go

Source: https://go.dev/doc/tutorial/greetings-multiple-people

Adds a `Hellos` function to the greetings package that takes a slice of names and returns a map of greetings for each name. It utilizes the existing `Hello` function for individual greetings and handles potential errors. This approach maintains backward compatibility by not altering the original `Hello` function's signature.

```go
package greetings

import (
    "errors"
    "fmt"
    "math/rand"
)

// Hello returns a greeting for the named person.
func Hello(name string) (string, error) {
    // If no name was given, return an error with a message.
    if name == "" {
        return name, errors.New("empty name")
    }
    // Create a message using a random format.
    message := fmt.Sprintf(randomFormat(), name)
    return message, nil
}

// Hellos returns a map that associates each of the named people
// with a greeting message.
func Hellos(names []string) (map[string]string, error) {
    // A map to associate names with messages.
    messages := make(map[string]string)
    // Loop through the received slice of names, calling
    // the Hello function to get a message for each name.
    for _, name := range names {
        message, err := Hello(name)
        if err != nil {
            return nil, err
        }
        // In the map, associate the retrieved message with
        // the name.
        messages[name] = message
    }
    return messages, nil
}

// randomFormat returns one of a set of greeting messages. The returned
// message is selected at random.
func randomFormat() string {
    // A slice of message formats.
    formats := []string{
        "Hi, %v. Welcome!",
        "Great to see you, %v!",
        "Hail, %v! Well met!",
    }

    // Return one of the message formats selected at random.
    return formats[rand.Intn(len(formats))]
}

```

--------------------------------

### Go Equivalent String Representations

Source: https://go.dev/doc/go_spec

Illustrates multiple ways to represent the same string literal in Go, including using UTF-8 input text, raw literals, explicit Unicode code points, and explicit UTF-8 bytes.

```go
"日本語"                                 // UTF-8 input text
`日本語`                                 // UTF-8 input text as a raw literal
"\u65e5\u672c\u8a9e"                    // the explicit Unicode code points
"\U000065e5\U0000672c\U00008a9e"        // the explicit Unicode code points
"\xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e"  // the explicit UTF-8 bytes
```

--------------------------------

### Go 1.13 Binary and Octal Literals

Source: https://go.dev/doc/go_spec

Demonstrates the use of `0b` and `0o` prefixes for binary and octal integer literals, introduced in Go 1.13. This feature allows for more readable integer representations.

```Go
// Go 1.13+ allows binary and octal literals with prefixes 0b/0B and 0o/0O
var binaryLiteral = 0b1011
var octalLiteral = 0o755

```

--------------------------------

### Go: File Copy with Defer for Guaranteed Closing

Source: https://go.dev/doc/articles/defer_panic_recover

An improved version of the file copy function that uses defer statements to ensure both source and destination files are always closed, regardless of errors.

```Go
func CopyFile(dstName, srcName string) (written int64, err error) {
    src, err := os.Open(srcName)
    if err != nil {
        return
    }
    defer src.Close()

    dst, err := os.Create(dstName)
    if err != nil {
        return
    }
    defer dst.Close()

    return io.Copy(dst, src)
}

```

--------------------------------

### Run Go Application with FIPS 140-3 Mode Enabled via GODEBUG

Source: https://go.dev/doc/security/fips140

This shows how to control the FIPS 140-3 operational mode at runtime using the `GODEBUG` environment variable. Setting it to 'on' or 'only' activates different levels of FIPS compliance checks and algorithm restrictions.

```bash
# Run with FIPS 140-3 mode enabled (default behavior)
GODEBUG=fips140=on go run main.go

# Run with FIPS 140-3 mode strictly enforced; non-compliant algorithms will error/panic
GODEBUG=fips140=only go run main.go
```

--------------------------------

### Create a Go Slice from an Array

Source: https://go.dev/doc/articles/slices_usage_and_internals

Shows how to create a new slice that references the underlying storage of an existing array. The slicing syntax `x[:]` creates a slice covering the entire array. The elements of the slice share the same memory as the array.

```go
x := [3]string{"Лайка", "Белка", "Стрелка"}
s := x[:] // a slice referencing the storage of x
```

--------------------------------

### Handle non-TLS more robustly and support SSLv3 in crypto/tls Go

Source: https://go.dev/doc/devel/weekly

The crypto/tls package has been updated to handle non-TLS connections more robustly and to add support for SSLv3. This improves the security and compatibility of TLS/SSL communication.

```Go
package main

import (
	"crypto/tls"
	"fmt"
	"net"
)

func main() {
	// This is a conceptual example demonstrating the use of tls.Config
	// The actual implementation details of robust non-TLS handling and SSLv3
	// support are within the crypto/tls package itself.

	config := &tls.Config{
		// MinVersion: tls.VersionSSL30, // To explicitly enable SSLv3 (use with caution)
		// In modern Go versions, SSLv3 is often disabled by default due to security risks.
	}

	// Example of attempting to create a TLS connection
	// conn, err := tls.Dial("tcp", "example.com:443", config)
	// if err != nil {
	// 	fmt.Println("Failed to establish TLS connection:", err)
	// 	return
	// }
	// defer conn.Close()

	fmt.Println("crypto/tls package updated for robustness and SSLv3 support.")
}
```

--------------------------------

### Go Pig Game Simulation Core Logic

Source: https://go.dev/doc/codewalk_fileprint=%2Fdoc%2Fcodewalk%2Fpig

Implements the core game logic for Pig, including rolling dice, staying, and managing player scores. It defines the game's winning condition and structures the game flow.

```go
// Copyright 2011 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"fmt"
	"math/rand"
)

const (
	win            = 100 // The winning score in a game of Pig
	gamesPerSeries = 10  // The number of games per series to simulate
)

// A score includes scores accumulated in previous turns for each player,
// as well as the points scored by the current player in this turn.
type score struct {
	player, opponent, thisTurn int
}

// An action transitions stochastically to a resulting score.
type action func(current score) (result score, turnIsOver bool)

// roll returns the (result, turnIsOver) outcome of simulating a die roll.
// If the roll value is 1, then thisTurn score is abandoned, and the players' roles swap.
// Otherwise, the roll value is added to thisTurn.
func roll(s score) (score, bool) {
	outcome := rand.Intn(6) + 1 // A random int in [1, 6]
	if outcome == 1 {
		return score{s.opponent, s.player, 0}, true
	}
	return score{s.player, s.opponent, outcome + s.thisTurn}, false
}

// stay returns the (result, turnIsOver) outcome of staying.
// thisTurn score is added to the player's score, and the players' roles swap.
func stay(s score) (score, bool) {
	return score{s.opponent, s.player + s.thisTurn, 0}, true
}

// A strategy chooses an action for any given score.
type strategy func(score) action

// stayAtK returns a strategy that rolls until thisTurn is at least k, then stays.
func stayAtK(k int) strategy {
	return func(s score) action {
		if s.thisTurn >= k {
			return stay
		}
		return roll
	}
}

// play simulates a Pig game and returns the winner (0 or 1).
func play(strategy0, strategy1 strategy) int {
	strategies := []strategy{strategy0, strategy1}
	var s score
	var turnIsOver bool
	currentPlayer := rand.Intn(2) // Randomly decide who plays first
	for s.player+s.thisTurn < win {
		action := strategies[currentPlayer](s)
		s, turnIsOver = action(s)
		if turnIsOver {
			currentPlayer = (currentPlayer + 1) % 2
		}
	}
	return currentPlayer
}

// roundRobin simulates a series of games between every pair of strategies.
func roundRobin(strategies []strategy) ([]int, int) {
	wins := make([]int, len(strategies))
	for i := 0; i < len(strategies); i++ {
		for j := i + 1; j < len(strategies); j++ {
			for k := 0; k < gamesPerSeries; k++ {
				winner := play(strategies[i], strategies[j])
				if winner == 0 {
					wins[i]++
				} else {
					wins[j]++
				}
			}
		}
	}
	gamesPerStrategy := gamesPerSeries * (len(strategies) - 1) // no self play
	return wins, gamesPerStrategy
}


// ratioString takes a list of integer values and returns a string that lists
// each value and its percentage of the sum of all values.
// e.g., ratios(1, 2, 3) = "1/6 (16.7%), 2/6 (33.3%), 3/6 (50.0%)"
func ratioString(vals ...int) string {

	total := 0
	for _, val := range vals {
		total += val
	}
	s := ""
	for _, val := range vals {
		if s != "" {
			s += ", "
		}
		pct := 100 * float64(val) / float64(total)
		s += fmt.Sprintf("%d/%d (%0.1f%%)", val, total, pct)
	}
	return s
}

func main() {
	strategies := make([]strategy, win)
	for k := range strategies {
		strategies[k] = stayAtK(k + 1)
	}
	wins, games := roundRobin(strategies)

	for k := range strategies {
		fmt.Printf("Wins, losses staying at k =% 4d: %s\n",
			k+1, ratioString(wins[k], games-wins[k]))
	}
}

```

--------------------------------

### Go: Assigning Concrete Value to Interface

Source: https://go.dev/doc/articles/laws_of_reflection

Demonstrates assigning a concrete value (*os.File) to an interface variable (io.Reader). The interface stores both the concrete value and its type descriptor.

```go
var r io.Reader
tty, err := os.OpenFile("/dev/tty", os.O_RDWR, 0)
if err != nil {
    return nil, err
}
r = tty
```

--------------------------------

### Define Go Request Struct for RPC

Source: https://go.dev/doc/effective_go

Defines the 'Request' struct used in a Go RPC system. It includes arguments, a function to execute, and a channel for returning results. This structure facilitates sending tasks and receiving their outputs asynchronously.

```Go
type Request struct {
    args        []int
    f           func([]int) int
    resultChan  chan int
}

```

--------------------------------

### Declare Variadic Function 'ratioString' in Go

Source: https://go.dev/doc/codewalk/functions

Declares a variadic function 'ratioString' that accepts a variable number of arguments. Inside the function, these arguments are treated as a slice, allowing flexible input handling.

```go
func ratioString(strs ...string) string {
	return strings.Join(strs, " ")
}

```

--------------------------------

### Set GODEBUG Defaults in go.mod/go.work

Source: https://go.dev/doc/godebug

This snippet shows how to set default GODEBUG values using the `godebug` directive within a Go module's go.mod or a workspace's go.work file. It allows specifying a default Go version for unspecified settings and overriding individual settings. Directives in dependency modules are ignored, and unrecognized settings result in an error. Toolchains older than Go 1.23 reject all `godebug` lines.

```go.mod
godebug (
    default=go1.21
    panicnil=1
    asynctimerchan=0
)

```

--------------------------------

### Go Handler Function Signatures

Source: https://go.dev/doc/articles/wiki

Defines the expected function signature for web handlers that accept a title string, commonly used with Go's http package.

```go
func viewHandler(w http.ResponseWriter, r *http.Request, title string)
func editHandler(w http.ResponseWriter, r *http.Request, title string)
func saveHandler(w http.ResponseWriter, r *http.Request, title string)
```

--------------------------------

### Integrate Path Validation in Edit Handler (Go)

Source: https://go.dev/doc/articles/wiki

The `editHandler` in Go first validates the URL path using `getTitle`. If the path is valid, it attempts to load the page data. If the page does not exist, it initializes a new `Page` struct with the title. Finally, it renders the edit template, either with existing page data or for a new page.

```Go
import "net/http"

func editHandler(w http.ResponseWriter, r *http.Request) {
	title, err := getTitle(w, r)
	if err != nil {
		return
	}
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}
```

--------------------------------

### Go errors.New Function for Basic Errors

Source: https://go.dev/doc/articles/error_handling

Demonstrates how to create a simple error using the `errors.New` function from the `errors` package. This function takes a string and returns an `error` value, typically of the internal `errorString` type.

```go
// New returns an error that formats as the given text.
func New(text string) error {
    return &errorString{text}
}
```

--------------------------------

### Build Go Package Without Compiler Optimizations

Source: https://go.dev/doc/diagnostics

Builds a Go package with compiler optimizations disabled using the -gcflags '-N -l' flags. This is recommended for easier debugging by preventing optimizations like function inlining and variable registerization.

```bash
$ go build -gcflags=all="-N -l"
```

--------------------------------

### Limit Throughput with Buffered Channels

Source: https://go.dev/doc/effective_go

Shows how a buffered channel can act as a semaphore to limit the number of concurrent operations. Sending to a full buffer blocks until a receiver frees up space.

```go
var sem = make(chan int, MaxOutstanding)

func handle(r *Request) {
    sem <- 1    // Wait for active queue to drain.
    process(r)  // May take a long time.
    <-sem       // Done; enable next request to run.
}

func Serve(queue chan *Request) {
    for {
        req := <-queue
        go handle(req)  // Don't wait for handle to finish.
    }
}
```

--------------------------------

### Parallelize Vector Operation in Go

Source: https://go.dev/doc/effective_go

Shows a Go method 'DoSome' that performs an operation on a portion of a Vector and signals completion via a channel. This is a building block for parallelizing computations.

```Go
type Vector []float64

// Apply the operation to v[i], v[i+1] ... up to v[n-1].
func (v Vector) DoSome(i, n int, u Vector, c chan int) {
    for ; i < n; i++ {
        v[i] += u.Op(v[i])
    }
    c <- 1    // signal that this piece is done
}

```

--------------------------------

### Go Code Comments: Notes (TODO, BUG)

Source: https://go.dev/doc/comment

Demonstrates the use of special markers like TODO and BUG in Go code comments for annotations. These notes are collected and rendered separately on pkg.go.dev. The format is MARKER(uid): body, where MARKER is at least two uppercase letters and uid is at least one character.

```go
// TODO(user1): refactor to use standard library context
// BUG(user2): not cleaned up
var ctx context.Context

```

--------------------------------

### Go fmt.Errorf for Formatted Errors

Source: https://go.dev/doc/articles/error_handling

Illustrates using `fmt.Errorf` to create an error with formatted output, similar to `fmt.Sprintf`. This allows including dynamic information within the error message.

```go
if f < 0 {
    return 0, fmt.Errorf("math: square root of negative number %g", f)
}
```

--------------------------------

### Go Method Values: Pointer/Value Receiver Equivalence

Source: https://go.dev/doc/go_spec

Demonstrates how Go automatically handles receiver types when creating method values. It shows that `pt.Mv` is equivalent to `(*pt).Mv` and `t.Mp` is equivalent to `(&t).Mp`, simplifying method value creation.

```go
type T struct {
	a int
}
func (tv  T) Mv(a int) int         { return 0 }  // value receiver
func (tp *T) Mp(f float32) float32 { return 1 }  // pointer receiver

var t T
var pt *T

f := t.Mv; f(7)   // like t.Mv(7)
f := pt.Mp; f(7)  // like pt.Mp(7)
f := pt.Mv; f(7)  // like (*pt).Mv(7)
f := t.Mp; f(7)   // like (&t).Mp(7)

// f := makeT().Mp   // invalid: result of makeT() is not addressable

```

--------------------------------

### GODEBUG: New asynctimerchan Behavior (Go 1.23)

Source: https://go.dev/doc/modules/gomod-ref

Demonstrates how to enable the new 'asynctimerchan=0' behavior introduced in Go 1.23 using the 'godebug' command. This setting affects timer channel behavior.

```bash
godebug asynctimerchan=0

```

--------------------------------

### GDB Commands for Inspecting Go Globals and Runtime

Source: https://go.dev/doc/gdb

This section covers GDB commands for inspecting global variables in Go programs and provides an overview of Go-specific extensions that enhance debugging capabilities. These extensions allow pretty-printing of Go data structures and inspection of runtime elements like goroutines.

```gdb
(gdb) info variables _regexp_
(gdb) p _var_
(gdb) p $len(_var_)
(gdb) p $dtype(_var_)
(gdb) iface _var_
(gdb) info goroutines
(gdb) goroutine _n_ _cmd_
(gdb) goroutine all bt
```

--------------------------------

### Load Page Function (Error Handling) in Go

Source: https://go.dev/doc/articles/wiki

Refactors `loadPage` to properly handle errors during file reading. It now returns both a `*Page` and an `error`. If `os.ReadFile` encounters an error, it returns `nil` for the page and the encountered error. Otherwise, it returns the loaded page and `nil` for the error.

```go
func loadPage(title string) (*Page, error) {
    filename := title + ".txt"
    body, err := os.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    return &Page{Title: title, Body: body}, nil
}

```

--------------------------------

### GDB Support for Interfaces and Goroutines

Source: https://go.dev/doc/devel/weekly

The [68]l linkers and runtime now include GDB support for debugging interfaces and goroutines, improving the debugging experience for concurrent Go programs.

```shell
# Example GDB command (conceptual)
gdb ./your_program
info goroutines
```

--------------------------------

### Call Generic Function with Inferred Type Arguments (Go)

Source: https://go.dev/doc/tutorial/generics

Demonstrates calling a generic function `SumIntsOrFloats` without explicitly providing type arguments. The Go compiler infers the types from the function's arguments. This method simplifies the calling code when the types are unambiguous.

```Go
fmt.Printf("Generic Sums, type parameters inferred: %v and %v\n",
    SumIntsOrFloats(ints),
    SumIntsOrFloats(floats))

```

--------------------------------

### Go: Custom String Representation with String() Method

Source: https://go.dev/doc/effective_go

Shows how to define a custom string representation for a Go type by implementing the `String() string` method. This method is automatically called by `fmt.Print` and related functions when printing values of that type. It highlights the need to avoid recursion when calling `fmt.Sprintf` within the `String` method.

```go
type T struct {
    a int
    b float64
    c string
}
func (t *T) String() string {
    return fmt.Sprintf("%d/%g/%q", t.a, t.b, t.c)
}

t := &T{ 7, -2.35, "abc\tdef" }
fmt.Printf("%v\n", t)
```

--------------------------------

### Create Basic 'stayAtK' Strategy Function Literal in Go

Source: https://go.dev/doc/codewalk/functions

Implements a basic strategy using a function literal (closure) that continues rolling until at least 'k' points are accumulated in a turn, then stays. The 'k' value is enclosed by the function literal.

```go
func stayAtK(k int) strategy {
	return func(s score) action {
		if s.turn >= k {
			return stay
		}
		return roll
	}
}

```

--------------------------------

### Go Path Matching Pattern Syntax

Source: https://go.dev/doc/comment

This Go code snippet defines the `Match` function for shell pattern matching and details the syntax for the pattern itself, including terms, character ranges, and special characters.

```Go
package path

// Match reports whether name matches the shell pattern.
// The pattern syntax is:
//
//  pattern:
//      { term }
//  term:
//      '*'         matches any sequence of non-/ characters
//      '?'         matches any single non-/ character
//      '[' [ '^' ] { character-range } ']'
//                  character class (must be non-empty)
//      c           matches character c (c != '*', '?', '\\', '[')
//      '\\' c      matches character c
//
//  character-range:
//      c           matches character c (c != '\\', '-', ']')
//      '\\' c      matches character c
//      lo '-' hi   matches character c for lo <= c <= hi
//
// Match requires pattern to match all of name, not just a substring.
// The only possible returned error is [ErrBadPattern], when pattern
// is malformed.
func Match(pattern, name string) (matched bool, err error) {
    ...
}
```

--------------------------------

### Go Simple Slice Expression with Pointers and Nil Slices

Source: https://go.dev/doc/go_spec

Explains slice expressions involving pointers to arrays and nil slices in Go. It demonstrates how slices share underlying arrays and how a nil slice results in a nil slice.

```Go
var a [10]int
s1 := a[3:7]   // underlying array of s1 is array a; &s1[2] == &a[5]
s2 := s1[1:4]  // underlying array of s2 is underlying array of s1 which is array a; &s2[1] == &a[5]
s2[1] = 42     // s2[1] == s1[2] == a[5] == 42; they all refer to the same underlying array element

var s []int
s3 := s[:0]    // s3 == nil
```

--------------------------------

### Go fmt Package Errorf Helper Function

Source: https://go.dev/doc/devel/weekly

This code snippet demonstrates the usage of the new Errorf helper function added to the Go fmt package. This function allows for the creation of formatted error strings, similar to Printf. It also highlights the new capability to use the %d verb with byte slices ([]byte). This enhances error handling and data formatting within Go applications.

```go
// Add Errorf helper function
// Allow %d on []byte
```