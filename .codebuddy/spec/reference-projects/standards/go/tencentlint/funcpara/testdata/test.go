package testdata

func a() {}

func b(A int) {} // want `A should start with lowercase`

func c() (Err error) { return nil } // want `Err should start with lowercase`

func d(a, A int) {} // want `A should start with lowercase`

func e(int) error { return nil }
