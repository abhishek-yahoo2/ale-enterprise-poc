// Custom ts-jest AST transformer that replaces import.meta.env.X with process.env.X
// This is needed because import.meta.env is a Vite-specific API not available in Jest

import type { TsCompilerInstance } from 'ts-jest';
import ts from 'typescript';

export const name = 'import-meta-env-transformer';
export const version = '1';

export function factory(_compilerInstance: TsCompilerInstance) {
  return (context: ts.TransformationContext) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Replace import.meta.env.X with process.env.X
      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isMetaProperty(node.expression.expression) &&
        node.expression.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
        ts.isIdentifier(node.expression.name) &&
        node.expression.name.text === 'env'
      ) {
        return ts.factory.createPropertyAccessExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('process'),
            ts.factory.createIdentifier('env')
          ),
          node.name
        );
      }

      // Replace bare import.meta.env with process.env
      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isMetaProperty(node.expression) &&
        node.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
        ts.isIdentifier(node.name) &&
        node.name.text === 'env'
      ) {
        return ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('process'),
          ts.factory.createIdentifier('env')
        );
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return (sourceFile: ts.SourceFile) => ts.visitNode(sourceFile, visitor) as ts.SourceFile;
  };
}
