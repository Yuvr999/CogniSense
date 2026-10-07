# Fairness Audit Metrics (Synthetic Data)

## Subgroup: Age
| Subgroup   |   N |    AUROC |   Sensitivity |   Specificity |   Indeterminate Rate |
|:-----------|----:|---------:|--------------:|--------------:|---------------------:|
| 65-74      | 133 | 0.524515 |      0.431818 |      0.595506 |             0.210526 |
| >=75       | 220 | 0.451315 |      0.323077 |      0.612903 |             0.136364 |
| <65        | 147 | 0.554671 |      0.369565 |      0.683168 |             0.14966  |

## Subgroup: Sex
| Subgroup   |   N |    AUROC |   Sensitivity |   Specificity |   Indeterminate Rate |
|:-----------|----:|---------:|--------------:|--------------:|---------------------:|
| F          | 237 | 0.460511 |      0.363636 |      0.56875  |             0.160338 |
| M          | 263 | 0.54307  |      0.371795 |      0.681081 |             0.159696 |

## Subgroup: Education
| Subgroup   |   N |    AUROC |   Sensitivity |   Specificity |   Indeterminate Rate |
|:-----------|----:|---------:|--------------:|--------------:|---------------------:|
| <=12       | 163 | 0.599535 |      0.530612 |      0.578947 |             0.141104 |
| >12        | 337 | 0.465654 |      0.292453 |      0.65368  |             0.169139 |

## Proxy Audit (AUROC of predicting demographic from features)
- Sex Proxy AUROC: 0.512
- Education Proxy AUROC: 0.487
