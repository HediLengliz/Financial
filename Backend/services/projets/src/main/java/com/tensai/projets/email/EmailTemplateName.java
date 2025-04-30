package com.tensai.projets.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    ASSIGN_ROLE("assign_role");

    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}