package com.tensai.financial.Config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Configuration;

@Aspect
@Configuration
@Slf4j
public class MethodMonitoring {
    @Pointcut("execution(* com.tensai.financial.Services.BudgetService.*(..)) || " +
            "execution(* com.tensai.financial.Services.ExpenseService.*(..)) || " +
            "execution(* com.tensai.financial.Services.InvoiceService.*(..))")
    public void monitor() {}

    @Around("monitor()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        log.info("Entering method: " + methodName);
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable throwable) {
            log.error("Exception in method: " + methodName, throwable);
            throw throwable;
        }
        log.info("Exiting method: " + methodName);
        return result;
    }
}
