package tn.esprit.myfirstproject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class MyFirstProjectApplicationTests {

    // Dummy dependency class for testing
    public static class ExampleDependency {
        public String someMethod() {
            return "real value";
        }
        public int compute(int a, int b) {
            return a + b;
        }
    }

    // Dummy service class for testing
    public static class ExampleService {
        private final ExampleDependency dependency;

        public ExampleService(ExampleDependency dependency) {
            this.dependency = dependency;
        }

        public String someMethod() {
            return dependency.someMethod();
        }

        public int computeSum(int x, int y) {
            return dependency.compute(x, y);
        }
    }

    @Mock
    private ExampleDependency dependency;

    private ExampleService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new ExampleService(dependency);
    }

    @Test
    void testSomeMethod_MockedValue() {
        when(dependency.someMethod()).thenReturn("mocked value");
        String result = service.someMethod();
        assertEquals("mocked value", result);
    }

    @Test
    void testSomeMethod_RealValue() {
        // Test without mocking to see real value
        ExampleDependency realDep = new ExampleDependency();
        ExampleService realService = new ExampleService(realDep);
        assertEquals("real value", realService.someMethod());
    }

    @Test
    void testComputeSum_Mocked() {
        when(dependency.compute(2, 3)).thenReturn(10);
        int result = service.computeSum(2, 3);
        assertEquals(10, result);
    }

    @Test
    void testComputeSum_Real() {
        ExampleDependency realDep = new ExampleDependency();
        ExampleService realService = new ExampleService(realDep);
        int result = realService.computeSum(2, 3);
        assertEquals(5, result);
    }
}
