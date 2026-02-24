@smoke
Feature: HiPay Fraud Management - Formulaire de contact via le CTA
  En tant que marchand potentiel
  Je veux cliquer sur "Request a tool demo" et remplir le formulaire
  Afin d'initier une demande de démo sans jamais soumettre le formulaire en production

  Background:
    Given I am on the HiPay Fraud Management page
    And any cookie consent banner is dismissed

  @smoke @regression
  Scenario: Le formulaire de contact peut être entièrement rempli sans être soumis
    When I click the "Request a tool demo" CTA
    Then the contact form section should be visible on the page
    And the contact form should be loaded and ready
    When I fill the contact form with valid demo data
    Then the form fields should contain the entered values
    And the submit button should be visible but not submitted
