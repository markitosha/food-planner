import { RecipeImage } from './recipe-image';
import { EditableName } from './editable-name';
import { EditableSubtitle } from './editable-subtitle';
import { RemoveButton } from './remove-button';
import { FullRecipe } from '@/db/types';
import { Card, Flex, Inset } from '@radix-ui/themes';

export function HeaderCard({ recipe }: { recipe: FullRecipe }) {
  return (
    <Card>
      <Flex gap={'2'}>
        <div style={{ position: 'relative' }}>
          <EditableName id={recipe.id}>{recipe.name}</EditableName>
          <EditableSubtitle id={recipe.id}>
            {recipe.description}
          </EditableSubtitle>
          <div style={{ position: 'absolute', bottom: '0' }}>
            <RemoveButton id={recipe.id} />
          </div>
        </div>
        <Inset side={'right'} pl={'current'}>
          <RecipeImage recipe={recipe} />
        </Inset>
      </Flex>
    </Card>
  );
}
